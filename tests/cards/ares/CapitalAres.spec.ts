import { expect } from "chai";
import { CapitalAres } from "../../../src/cards/ares/CapitalAres";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { SpaceType } from "../../../src/SpaceType";
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { Resources } from "../../../src/Resources";
import { TileType } from "../../../src/TileType";
import { AdjacencyBonus, AresSpaceBonus } from "../../../src/cards/ares/AdjacencyBonus";

describe("CapitalAres", function () {
  let card : CapitalAres, player : Player, game : Game;

  beforeEach(function() {
    card = new CapitalAres();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player);
  });

  it("Should play", function () {
    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    for (let i = 0; i < 4; i++) {
        oceanSpaces[i].tile = { tileType: TileType.OCEAN };
    }
    player.setProduction(Resources.ENERGY,2);
    expect(card.canPlay(player, game)).to.eq(true);

    const action = card.play(player, game);
    expect(action instanceof SelectSpace).to.eq(true);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);

    debugger;
    const citySpace = game.board.getAdjacentSpaces(oceanSpaces[0])[0];
    expect(citySpace.spaceType).to.eq(SpaceType.LAND); 
    action.cb(citySpace);
    
    expect(citySpace.tile).not.to.eq(undefined);
    expect(citySpace.player).to.eq(player);
    expect(citySpace.tile && citySpace.tile.tileType).to.eq(TileType.CAPITAL);
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(0);
    expect(card.getVictoryPoints(player, game)).to.eq(1);
    expect(citySpace.adjacency?.bonus).to.deep.eq(AdjacencyBonus.ofAresSpaceBonus(2, AresSpaceBonus.MC));
  });

});
