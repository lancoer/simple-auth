use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::states::{AuthenticationState, AUTHENTICATION_STATE_SEED};

#[derive(Accounts)]
pub struct Initialize<'info> {
    /// Only admin or owner can initialize users' authentication state
    #[account(
        mut,
        address = crate::admin::id() @ ErrorCode::InvalidOwner
    )]
    pub owner: Signer<'info>,

    /// Initialize authentication state account
    #[account(init, seeds=[AUTHENTICATION_STATE_SEED.as_bytes()], bump, payer = owner, space = AuthenticationState::LEN)]
    pub authentication_state: Account<'info, AuthenticationState>,

    pub system_program: Program<'info, System>,
}

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let authentication_state = &mut ctx.accounts.authentication_state;

    authentication_state.bump = ctx.bumps.authentication_state;
    authentication_state.is_authenticated = false;
    authentication_state.nonce = 0;

    Ok(())
}
