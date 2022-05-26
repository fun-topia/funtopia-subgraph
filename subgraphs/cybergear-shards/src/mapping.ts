import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  SpawnCss,
  Transfer
} from "../generated/CS/CS"
import { CsInfo, CsCount, CsCountByOwner } from "../generated/schema"

export function handleSpawnCss(event: SpawnCss): void {
  for (let i = 0; i < event.params.csIds.length; i++) {
    let csInfo = CsInfo.load(event.params.csIds[i].toHex());
    if (!csInfo) {
      csInfo = new CsInfo(event.params.csIds[i].toHex());
      csInfo.csId = event.params.csIds[i];
    }

    const heroToRarity = [1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];

    csInfo.owner = event.params.to;
    csInfo.hero = event.params.heros[i];
    if (csInfo.hero.equals(BigInt.fromI32(100))) {
      csInfo.rarity = BigInt.fromI32(10);
    } else {
      csInfo.rarity = BigInt.fromI32(heroToRarity[csInfo.hero.toI32() - 1]);
    }

    csInfo.save();

    let csCount = CsCount.load(BigInt.fromI32(0).toHex());
    if (!csCount) {
      csCount = new CsCount(BigInt.fromI32(0).toHex());
    }

    csCount.total = csCount.total.plus(BigInt.fromI32(1));
    if (csInfo.rarity.equals(BigInt.fromI32(1))) {
      csCount.r = csCount.r.plus(BigInt.fromI32(1));
    } else if (csInfo.rarity.equals(BigInt.fromI32(2))) {
      csCount.sr = csCount.sr.plus(BigInt.fromI32(1));
    } else if (csInfo.rarity.equals(BigInt.fromI32(3))) {
      csCount.ur = csCount.ur.plus(BigInt.fromI32(1));
    } else if (csInfo.rarity.equals(BigInt.fromI32(4))) {
      csCount.mr = csCount.mr.plus(BigInt.fromI32(1));
    } else {
      csCount.uni = csCount.uni.plus(BigInt.fromI32(1));
    }

    csCount.save();

    let csCountByOwner = CsCountByOwner.load(event.params.to.toHex());
    if (!csCountByOwner) {
      csCountByOwner = new CsCountByOwner(event.params.to.toHex());
      csCountByOwner.owner = event.params.to;
    }

    csCountByOwner.total = csCountByOwner.total.plus(BigInt.fromI32(1));
    if (csInfo.rarity.equals(BigInt.fromI32(1))) {
      csCountByOwner.r = csCountByOwner.r.plus(BigInt.fromI32(1));
    } else if (csInfo.rarity.equals(BigInt.fromI32(2))) {
      csCountByOwner.sr = csCountByOwner.sr.plus(BigInt.fromI32(1));
    } else if (csInfo.rarity.equals(BigInt.fromI32(3))) {
      csCountByOwner.ur = csCountByOwner.ur.plus(BigInt.fromI32(1));
    } else if (csInfo.rarity.equals(BigInt.fromI32(4))) {
      csCountByOwner.mr = csCountByOwner.mr.plus(BigInt.fromI32(1));
    } else {
      csCountByOwner.uni = csCountByOwner.uni.plus(BigInt.fromI32(1));
    }

    csCountByOwner.save();
  }
}

export function handleTransfer(event: Transfer): void {
  if (event.params.from.notEqual(Address.zero())) {
    let csInfo = CsInfo.load(event.params.tokenId.toHex());
    if (!csInfo) {
      csInfo = new CsInfo(event.params.tokenId.toHex());
      csInfo.csId = event.params.tokenId;
    }

    csInfo.owner = event.params.to;

    csInfo.save();

    let csCountByOwnerFrom = CsCountByOwner.load(event.params.from.toHex());
    if (!csCountByOwnerFrom) {
      csCountByOwnerFrom = new CsCountByOwner(event.params.from.toHex());
      csCountByOwnerFrom.owner = event.params.from;
    }

    csCountByOwnerFrom.total = csCountByOwnerFrom.total.minus(BigInt.fromI32(1));
    if (csInfo.rarity.equals(BigInt.fromI32(1))) {
      csCountByOwnerFrom.r = csCountByOwnerFrom.r.minus(BigInt.fromI32(1));
    } else if (csInfo.rarity.equals(BigInt.fromI32(2))) {
      csCountByOwnerFrom.sr = csCountByOwnerFrom.sr.minus(BigInt.fromI32(1));
    } else if (csInfo.rarity.equals(BigInt.fromI32(3))) {
      csCountByOwnerFrom.ur = csCountByOwnerFrom.ur.minus(BigInt.fromI32(1));
    } else if (csInfo.rarity.equals(BigInt.fromI32(4))) {
      csCountByOwnerFrom.mr = csCountByOwnerFrom.mr.minus(BigInt.fromI32(1));
    } else {
      csCountByOwnerFrom.uni = csCountByOwnerFrom.uni.minus(BigInt.fromI32(1));
    }

    csCountByOwnerFrom.save();

    let csCountByOwnerTo = CsCountByOwner.load(event.params.to.toHex());
    if (!csCountByOwnerTo) {
      csCountByOwnerTo = new CsCountByOwner(event.params.to.toHex());
      csCountByOwnerTo.owner = event.params.to;
    }

    csCountByOwnerTo.total = csCountByOwnerTo.total.plus(BigInt.fromI32(1));
    if (csInfo.rarity.equals(BigInt.fromI32(1))) {
      csCountByOwnerTo.r = csCountByOwnerTo.r.plus(BigInt.fromI32(1));
    } else if (csInfo.rarity.equals(BigInt.fromI32(2))) {
      csCountByOwnerTo.sr = csCountByOwnerTo.sr.plus(BigInt.fromI32(1));
    } else if (csInfo.rarity.equals(BigInt.fromI32(3))) {
      csCountByOwnerTo.ur = csCountByOwnerTo.ur.plus(BigInt.fromI32(1));
    } else if (csInfo.rarity.equals(BigInt.fromI32(4))) {
      csCountByOwnerTo.mr = csCountByOwnerTo.mr.plus(BigInt.fromI32(1));
    } else {
      csCountByOwnerTo.uni = csCountByOwnerTo.uni.plus(BigInt.fromI32(1));
    }

    csCountByOwnerTo.save();
  }
}
