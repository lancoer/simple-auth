use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::states::{AuthenticationState, AUTHENTICATION_STATE_SEED};

#[derive(Accounts)]
#[instruction(user: Pubkey)]
pub struct Authenticate<'info> {
    /// Only admin or owner can authenticate users
    #[account(address = crate::admin::id() @ ErrorCode::InvalidOwner)]
    pub owner: Signer<'info>,

    /// Authentication state account to be changed
    #[account(mut, seeds=[AUTHENTICATION_STATE_SEED.as_bytes(), user.key().as_ref()], bump)]
    pub authentication_state: Account<'info, AuthenticationState>,

    pub system_program: Program<'info, System>,
}

pub fn authenticate(ctx: Context<Authenticate>) -> Result<()> {
    let authentication_state = &mut ctx.accounts.authentication_state;

    authentication_state.is_authenticated = true;
    authentication_state.nonce += 1;

    Ok(())
}
