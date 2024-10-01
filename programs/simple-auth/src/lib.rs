mod instructions;

pub mod error;
pub mod states;

use anchor_lang::prelude::*;

use instructions::*;

#[cfg(feature = "devnet")]
declare_id!("3wXUKJWB3eKzxC7d3YMdoVcHJfzadK4fTHt2pMwiXPAH");
#[cfg(not(feature = "devnet"))]
declare_id!("3wXUKJWB3eKzxC7d3YMdoVcHJfzadK4fTHt2pMwiXPAH");

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

    pub fn authenticate(ctx: Context<Authenticate>, user: Pubkey) -> Result<()> {
        instructions::authenticate(ctx, user)
    }

    pub fn deauthenticate(ctx: Context<Deauthenticate>, user: Pubkey) -> Result<()> {
        instructions::deauthenticate(ctx, user)
    }
}
