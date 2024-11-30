#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("39o3Jfso4ncRMNAcyNVscZLxbDrkXGePP4xpzJzoamXm");

#[program]
pub mod goal_chain {
    use super::*;

    pub fn initialize_game(ctx: Context<InitializeGame>,
                           game_id: u64,
                           description: String,
                           started_at: u64,
                           ended_at: u64) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.game_id = game_id;
        game.description = description;
        game.started_at = started_at;
        game.ended_at = ended_at;
        Ok(())
    }
}
#[derive(Accounts)]
#[instruction(game_id: u64)]
pub struct InitializeGame<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = 8 + Game::INIT_SPACE,
        seeds = [game_id.to_le_bytes().as_ref()],
        bump
    )]
    pub game: Account<'info, Game>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Game {
    pub game_id: u64,
    #[max_len(300)]
    pub description: String,
    pub started_at: u64,
    pub ended_at: u64,
}

