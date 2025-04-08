use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")] Std(#[from] StdError),

    #[error("Unauthorized")] Unauthorized {},

    #[error("Invalid Amount")] InvalidAmount {},

    #[error("Insufficient Funds")] InsufficientFunds {},

    #[error("Invalid Denom Sent")] InvalidDenomSent {},
}
