# Tommy Battle / Effect System Notes

Date: 2026-06-14

Source transcript:
/Users/binheshi/.codex/attachments/b03698dd-dd6d-4376-8df5-25f660b77861/pasted-text.txt

## Current Game Code Context

- Most of the old game code is concentrated in `Battle`.
- `Battle` currently takes over most in-match settlement/resolution.
- The old version has many known problems:
  - The battle view was changed from vertical to horizontal, closer to a Plants vs. Zombies style layout.
  - After rotating the view/camera, arrow alignment became incorrect.
  - The old battle UI and card UI are visually rough and need redesign.
  - Some old experimental systems and unused code should be cleaned before serious work continues.
- Before large changes, work should happen on a separate branch/backup rather than pushing unstable cleanup directly.

## Main Missing System

The core missing gameplay layer is the card effect system. Basic movement/attack/card placement exists conceptually, but the interesting card gameplay depends on importing and executing the new effect dictionary.

The effect system should not be written as one-off code per card. Effects should be decomposed into reusable grammar pieces.

## Effect Model

Tommy's proposed model separates effects into:

- Triggered effects: effects that run when a trigger condition is satisfied.
- Aura/passive effects: effects that remain attached to a carrier and continuously modify rules or stats while active.

Triggered effects should be decomposed into three major parts:

1. Trigger
   - Defines when an effect enters the settlement queue.
   - Should not be only a raw event node.
   - A trigger can have filters/parameters, such as:
     - `OnAttack` only when attacking a Machine unit.
     - `OnDePlace` depending on where the card goes after leaving the field.
     - `OnDamaged` depending on damage source/type.
   - The game should publish events for board actions, and trigger logic should inspect those events plus parameters.

2. Scope / Targeting
   - Targeting should be split into:
     - `PreScope`: first collect the candidate pool.
     - `Selector`: choose from that candidate pool.
     - Optional post-processing after selection.
   - Examples:
     - Deal 5 damage to a random unit on the board:
       - PreScope = all board units.
       - Selector = random 1.
     - Destroy the two units with the lowest HP:
       - PreScope = board units.
       - Selector = sort by HP ascending, take 2.
     - Player-chosen effects use player selection as the selector.

3. Effect Executor
   - Executes the concrete effect after trigger and target selection are resolved.
   - Atomic effects include damage, heal, modify stats, destroy, remove, draw, summon, add aura, etc.
   - Effects must receive a source/context and selected targets. Effects should never happen "out of nowhere."

## Source And Context Rules

- Every triggered effect must have a source/card/player that caused it.
- Every aura must have a carrier/host.
- Global permanent effects should be modeled as auras attached to a player/hero rather than directly modifying every existing and future card.
- Example:
  - "For the rest of the game, your Poros get +1/+1."
  - Scope of the triggered effect = your player/hero.
  - Effect = add a permanent aura to that player.
  - Aura = friendly Poros get +1/+1.

## Aura Model

- Auras should be treated as passive effects with:
  - A carrier/host, such as a minion or player.
  - A scope, such as adjacent Pirates or friendly Poros.
  - Parameters, such as stat changes or immunity source filters.
- Example unit aura:
  - A minion gives adjacent Pirates +1 attack while it remains on the board.
- Example player/global aura:
  - A player receives a permanent aura, and all future friendly Poros also receive the buff.
- `Elusive` / target immunity can be modeled as an aura:
  - Carrier = self.
  - Effect = this card cannot be selected as a target by effects matching source filters.
  - Parameters can distinguish enemy spells, friendly minion effects, all effects, etc.

## Zone And Destruction Semantics

- "Destroy" should not be implemented by setting HP to 0.
- Destroy means directly sending the target card to the discard pile.
- This matters because destroying a unit should not trigger "when HP changes" effects.
- Death / deathrattle-style semantics are defined as a card leaving the field and entering the discard pile.
- Leaving the field is broader than death:
  - It can apply to minions and spells.
  - It may include cards returning to hand or moving to another zone.
  - The destination matters.
- Remove is a separate concept:
  - Remove sends a card to a void/removed zone.
  - Removed cards should not return to the normal deck/discard cycle.

## Deck / Zone Definitions

- The game distinguishes deck/draw pile, discard pile, field, hand, and removed/void.
- "Current deck" and "decklist" concepts need strict definitions.
- Tommy's current design suggests:
  - A player's broader deck/set includes cards that have entered the player's deck or discard cycle and have not been removed.
  - Generated cards on the field that never entered deck/discard should not automatically count for effects that reference this broader deck/set.
- Effects that count card types in a deck/set should use these strict zone definitions.

## Suggested Implementation Direction

- Build or refactor around a clear effect grammar:
  - Event publishing from Battle.
  - Trigger registry / trigger folder.
  - Targeting engine using PreScope + Selector + final Scope.
  - Atomic effect executor.
  - Aura registry/manager.
- Avoid implementing one long custom function per card.
- Before code changes, formalize the exact rule semantics for:
  - Trigger filters.
  - Zone transitions.
  - Destroy vs damage vs remove.
  - Aura carrier lifecycle.
  - Permanent player auras.

## Website Relevance

The existing Effect Dictionary website page can be used as a visual reference for this grammar:

- Trigger: when an effect should react.
- Scope/Selector: how targets are chosen.
- Effect: what atomic behavior executes.
- Aura: what passive/continuous modifier remains active.

Future website work can expose these implementation notes as a "design-to-code" section, but it should not be pushed until reviewed locally.
