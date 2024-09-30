use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::states::{AuthenticationState, AUTHENTICATION_STATE_SEED};

#[derive(Accounts)]
pub struct Deauthenticate<'info> {
    /// Only admin or owner can deauthenticate users
    #[account(address = crate::admin::id() @ ErrorCode::InvalidOwner)]
    pub owner: Signer<'info>,

    /// Authentication state account to be changed
    #[account(mut, seeds=[AUTHENTICATION_STATE_SEED.as_bytes()], bump)]
    pub authentication_state: Account<'info, AuthenticationState>,

    pub system_program: Program<'info, System>,
}

pub fn deauthenticate(ctx: Context<Deauthenticate>) -> Result<()> {
    let authentication_state = &mut ctx.accounts.authentication_state;

    authentication_state.is_authenticated = false;
    authentication_state.nonce += 1;

    Ok(())
}
