mod authenticate {
    use anchor_lang::prelude::*;

    pub const AUTHENTICATION_STATE_SEED: &str = "authentication_state";

    #[account]
    pub struct AuthenticationState {
        /// Bump to identify PDA
        pub bump: u8,

        pub is_authenticated: bool,

        pub nonce: u64, // Just in case
    }

    impl AuthenticationState {
        pub const LEN: usize = 8 + (1 + 1 + 8);
    }
}

pub use authenticate::*;
