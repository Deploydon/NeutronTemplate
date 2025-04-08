//Super simple contract, lets users deposit/withdraw funds, increment their counter and a global counter, with admin controls to reset the global

#[cfg(not(feature = "library"))]
use crate::error::ContractError;
use crate::msg::{ ExecuteMsg, InstantiateMsg, MigrateMsg, QueryMsg };
use crate::state::{ Config, Global, Users, USERS, CONFIG, GLOBAL };

use cosmwasm_std::{
    entry_point,
    to_json_binary,
    Addr,
    Binary,
    Coin,
    Deps,
    DepsMut,
    Env,
    MessageInfo,
    Response,
    StdResult,
    Uint128,
    BankMsg,
};
use cw2::set_contract_version;

const CONTRACT_NAME: &str = "NeutronTemplate";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(deps: DepsMut, _env: Env, _msg: MigrateMsg) -> StdResult<Response> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    Ok(Response::new().add_attribute("action", "migrate"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    let admin = info.sender;

    let config = Config {
        admin: admin.clone(),
        denom: "untrn".to_string(),
    };

    let global = Global {
        counter: 0,
        last_action: None,
        last_user: None,
    };
    GLOBAL.save(deps.storage, &global)?;
    CONFIG.save(deps.storage, &config)?;
    Ok(Response::new().add_attribute("action", "instantiate"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Deposit {} => execute_deposit(deps, info, env),
        ExecuteMsg::Withdraw { amount } => execute_withdraw(deps, env, info, amount),
        ExecuteMsg::ResetGlobal {} => execute_reset_global(deps, info, env),
        ExecuteMsg::UserCounter {} => execute_user_counter(deps, info, env),
        ExecuteMsg::GlobalCounter {} => execute_global_counter(deps, env),
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => query_config(deps),
        QueryMsg::Global {} => query_global(deps),
        QueryMsg::User { user } => query_user(deps, user),
        QueryMsg::AllUsers { start_after, limit } => { query_all_users(deps, start_after, limit) }
    }
}

//EXECUTES

//Users can deposit into the contract
pub fn execute_deposit(
    deps: DepsMut,
    info: MessageInfo,
    env: Env
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;

    let deposit_amount = info.funds
        .iter()
        .find(|coin| coin.denom == config.denom)
        .ok_or(ContractError::InvalidDenomSent {})?.amount;

    if deposit_amount.is_zero() {
        return Err(ContractError::InvalidAmount {});
    }

    let mut user = USERS.may_load(deps.storage, info.sender.clone())?.unwrap_or(Users {
        counter: 0,
        deposits: Uint128::zero(),
        last_action: None,
    });

    user.deposits = user.deposits.checked_add(deposit_amount).unwrap();
    user.last_action = Some(env.block.time);
    USERS.save(deps.storage, info.sender.clone(), &user)?;

    Ok(
        Response::new()
            .add_attribute("action", "deposit")
            .add_attribute("amount", deposit_amount.to_string())
    )
}

//Users can withdraw
pub fn execute_withdraw(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    amount: Uint128
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;

    let mut user = USERS.may_load(deps.storage, info.sender.clone())?.unwrap_or(Users {
        counter: 0,
        deposits: Uint128::zero(),
        last_action: None,
    });

    if amount > user.deposits {
        return Err(ContractError::InsufficientFunds {});
    }

    user.deposits = user.deposits.checked_sub(amount).unwrap();
    user.last_action = Some(env.block.time);
    USERS.save(deps.storage, info.sender.clone(), &user)?;

    let transfer_msg = BankMsg::Send {
        to_address: info.sender.to_string(),
        amount: vec![Coin {
            denom: config.denom.clone(),
            amount: amount,
        }],
    };

    Ok(
        Response::new()
            .add_message(transfer_msg)
            .add_attribute("action", "withdraw")
            .add_attribute("amount", amount.to_string())
    )
}

//Userrs can increment their own counter
pub fn execute_user_counter(
    deps: DepsMut,
    info: MessageInfo,
    env: Env
) -> Result<Response, ContractError> {
    let mut user = USERS.may_load(deps.storage, info.sender.clone())?.unwrap_or(Users {
        counter: 0,
        deposits: Uint128::zero(),
        last_action: None,
    });

    user.counter += 1;
    user.last_action = Some(env.block.time);
    USERS.save(deps.storage, info.sender.clone(), &user)?;
    Ok(Response::new().add_attribute("action", "user_counter"))
}

//anyone can increment global counter
pub fn execute_global_counter(deps: DepsMut, env: Env) -> Result<Response, ContractError> {
    let mut global = GLOBAL.load(deps.storage)?;

    global.counter += 1;
    global.last_action = Some(env.block.time);
    GLOBAL.save(deps.storage, &global)?;
    Ok(Response::new().add_attribute("action", "global_counter"))
}

//Only the admin can reset the global counter
pub fn execute_reset_global(
    deps: DepsMut,
    info: MessageInfo,
    env: Env
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    if info.sender != config.admin {
        return Err(ContractError::Unauthorized {});
    }

    let mut global = GLOBAL.load(deps.storage)?;
    global.counter = 0;
    global.last_action = None;
    global.last_action = Some(env.block.time);
    GLOBAL.save(deps.storage, &global)?;

    Ok(Response::new().add_attribute("action", "reset_global"))
}

//QUERIES

pub fn query_config(deps: Deps) -> StdResult<Binary> {
    let config = CONFIG.load(deps.storage)?;
    to_json_binary(&config)
}

pub fn query_global(deps: Deps) -> StdResult<Binary> {
    let global = GLOBAL.load(deps.storage)?;
    to_json_binary(&global)
}

pub fn query_user(deps: Deps, user: Addr) -> StdResult<Binary> {
    let user = USERS.may_load(deps.storage, user)?.unwrap_or(Users {
        counter: 0,
        deposits: Uint128::zero(),
        last_action: None,
    });

    to_json_binary(&user)
}

pub fn query_all_users(
    deps: Deps,
    start_after: Option<Addr>,
    limit: Option<u32>
) -> StdResult<Binary> {
    let limit = limit.unwrap_or(50);
    let start = start_after.map(|addr| cw_storage_plus::Bound::exclusive(addr));

    let users: Vec<(Addr, Users)> = USERS.range(
        deps.storage,
        start,
        None,
        cosmwasm_std::Order::Ascending
    )
        .take(limit as usize)
        .filter_map(|res| {
            match res {
                Ok((addr, stats)) => Some((addr, stats)),
                Err(_) => None,
            }
        })
        .collect();

    to_json_binary(&users)
}
