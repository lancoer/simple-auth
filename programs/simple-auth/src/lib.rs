mod instructions;

pub mod error;
pub mod states;

use anchor_lang::prelude::*;

use instructions::*;

#[cfg(feature = "devnet")]
declare_id!("AGMbtK5VeHwtQjmFMBDxJP2dJa7ynyw7qswksStxaBbt");
#[cfg(not(feature = "devnet"))]
declare_id!("AGMbtK5VeHwtQjmFMBDxJP2dJa7ynyw7qswksStxaBbt");

pub mod admin {
    use anchor_lang::prelude::declare_id;

    #[cfg(feature = "devnet")]
    declare_id!("8wnpYgATzbThvG8dj8LrzNw3fPFeem2MkExst83WsDtm");
    #[cfg(not(feature = "devnet"))]
    declare_id!("8wnpYgATzbThvG8dj8LrzNw3fPFeem2MkExst83WsDtm");
}

#[program]
pub mod simple_auth {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, user: Pubkey) -> Result<()> {
        instructions::initialize(ctx, user)
    }

    pub fn authenticate(ctx: Context<Authenticate>) -> Result<()> {
        instructions::authenticate(ctx)
    }

    pub fn deauthenticate(ctx: Context<Deauthenticate>) -> Result<()> {
        instructions::deauthenticate(ctx)
    }
}
