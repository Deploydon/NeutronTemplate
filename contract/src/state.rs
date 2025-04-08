use cosmwasm_std::{ Addr, Timestamp, Uint128 };
use cw_storage_plus::{ Item, Map };
use schemars::JsonSchema;
use serde::{ Deserialize, Serialize };

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub admin: Addr,
    pub denom: String,
}
pub const CONFIG: Item<Config> = Item::new("config");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Users {
    pub counter: u64,
    pub deposits: Uint128,
    pub last_action: Option<Timestamp>,
}

pub const USERS: Map<Addr, Users> = Map::new("users");

//Simple test global state that anyone can increment
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Global {
    pub counter: u64,
    pub last_action: Option<Timestamp>,
    pub last_user: Option<Addr>,
}

pub const GLOBAL: Item<Global> = Item::new("global");
