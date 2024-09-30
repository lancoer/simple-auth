use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    /// The owner of the input isn't set to the program address
    #[msg("Input account owner is not the program address")]
    InvalidOwner,
}
