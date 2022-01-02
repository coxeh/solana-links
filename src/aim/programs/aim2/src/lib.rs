use anchor_lang::prelude::*;
//use url::{Url};

declare_id!("4M77xx2EAjoxPc6r6bZNEcijgQKFFKmbTL75keVpF7C7");

#[program]
pub mod aim2 {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, bump: u8, _name: String) -> ProgramResult {
        let username_account = &mut ctx.accounts.username;
        username_account.bump = bump;
        username_account.authority = *ctx.accounts.authority.key;
        Ok(())
    }
    pub fn create_link(ctx: Context<CreateLink>, url: String) -> Result<()> {
        let link = &mut ctx.accounts.link;
        link.url = url;
        link.authority = ctx.accounts.authority.key();
        link.username = ctx.accounts.username.key();

        // let parsed_url = Url::parse(&link.url).is_ok();

        // match parsed_url {
        //     true => Ok(()),
        //     false => Err(ErrorCode::InvalidUrl.into())
        // }
        Ok(())
    }
    pub fn delete_link(_ctx: Context<DeleteLink>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(bump: u8, name: String)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, seeds= [b"username", name.as_bytes()], bump=bump, space = 8 + 32 + 8)]
    pub username: Account<'info, UsernameAccount>,
    #[account()]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct CreateLink<'info> {
    #[account(has_one = authority)]
    pub username: Account<'info, UsernameAccount>,
    #[account(init, payer = authority, space = 8 + 32 + 32 + 255)]
    pub link: Account<'info, LinkAccount>,
    #[account()]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct DeleteLink<'info> {
    #[account(mut, has_one = authority, close = authority)]
    pub link: Account<'info, LinkAccount>,
    #[account()]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[account]
pub struct UsernameAccount {
    pub authority: Pubkey,
    pub bump: u8
}

#[account]
pub struct LinkAccount {
    pub authority: Pubkey,
    pub username: Pubkey,
    pub url: String
}

#[error]
pub enum ErrorCode {
    #[msg("Url is invalid")]
    InvalidUrl,
}