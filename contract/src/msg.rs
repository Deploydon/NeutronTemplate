#[allow(unused_imports)]
use crate::state::{ Config, Global, Users };
use cosmwasm_schema::{ cw_serde, QueryResponses };
use cosmwasm_std::{ Addr, Uint128 };
use schemars::JsonSchema;
use serde::{ Deserialize, Serialize };

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct MigrateMsg {}

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub enum ExecuteMsg {
    Deposit {},
    Withdraw {
        amount: Uint128,
    },
    ResetGlobal {},
    UserCounter {},
    GlobalCounter {},
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(Config)] Config {},
    #[returns(Global)] Global {},
    #[returns(Users)] User {
        user: Addr,
    },
    #[returns(Vec<(Addr, Users)>)] AllUsers {
        start_after: Option<Addr>,
        limit: Option<u32>,
    },
}
