import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  SpawnCn,
  Transfer
} from "../generated/CN/CN"
import { CnInfo, CnCount, CnCountByOwner } from "../generated/schema"

export function handleSpawnCn(event: SpawnCn): void {
  let cnInfo = CnInfo.load(event.params.cnId.toHex());
  if (!cnInfo) {
    cnInfo = new CnInfo(event.params.cnId.toHex());
    cnInfo.cnId = event.params.cnId;
  }

  const heroToRarity = [1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];

  cnInfo.owner = event.params.to;
  cnInfo.hero = event.params.hero;
  cnInfo.rarity = BigInt.fromI32(heroToRarity[cnInfo.hero.toI32() - 1]);

  cnInfo.save();

  let cnCount = CnCount.load(BigInt.fromI32(0).toHex());
  if (!cnCount) {
    cnCount = new CnCount(BigInt.fromI32(0).toHex());
  }

  cnCount.total = cnCount.total.plus(BigInt.fromI32(1));
  if (cnInfo.rarity.equals(BigInt.fromI32(1))) {
    cnCount.r = cnCount.r.plus(BigInt.fromI32(1));
  } else if (cnInfo.rarity.equals(BigInt.fromI32(2))) {
    cnCount.sr = cnCount.sr.plus(BigInt.fromI32(1));
  } else if (cnInfo.rarity.equals(BigInt.fromI32(3))) {
    cnCount.ur = cnCount.ur.plus(BigInt.fromI32(1));
  } else {
    cnCount.mr = cnCount.mr.plus(BigInt.fromI32(1));
  }

  cnCount.save();

  let cnCountByOwner = CnCountByOwner.load(event.params.to.toHex());
  if (!cnCountByOwner) {
    cnCountByOwner = new CnCountByOwner(event.params.to.toHex());
    cnCountByOwner.owner = event.params.to;
  }

  cnCountByOwner.total = cnCountByOwner.total.plus(BigInt.fromI32(1));
  if (cnInfo.rarity.equals(BigInt.fromI32(1))) {
    cnCountByOwner.r = cnCountByOwner.r.plus(BigInt.fromI32(1));
  } else if (cnInfo.rarity.equals(BigInt.fromI32(2))) {
    cnCountByOwner.sr = cnCountByOwner.sr.plus(BigInt.fromI32(1));
  } else if (cnInfo.rarity.equals(BigInt.fromI32(3))) {
    cnCountByOwner.ur = cnCountByOwner.ur.plus(BigInt.fromI32(1));
  } else {
    cnCountByOwner.mr = cnCountByOwner.mr.plus(BigInt.fromI32(1));
  }

  cnCountByOwner.save();
}

export function handleTransfer(event: Transfer): void {
  if (event.params.from.notEqual(Address.zero())) {
    let cnInfo = CnInfo.load(event.params.tokenId.toHex());
    if (!cnInfo) {
      cnInfo = new CnInfo(event.params.tokenId.toHex());
      cnInfo.cnId = event.params.tokenId;
    }

    cnInfo.owner = event.params.to;

    cnInfo.save();

    let cnCountByOwnerFrom = CnCountByOwner.load(event.params.from.toHex());
    if (!cnCountByOwnerFrom) {
      cnCountByOwnerFrom = new CnCountByOwner(event.params.from.toHex());
      cnCountByOwnerFrom.owner = event.params.from;
    }

    cnCountByOwnerFrom.total = cnCountByOwnerFrom.total.minus(BigInt.fromI32(1));
    if (cnInfo.rarity.equals(BigInt.fromI32(1))) {
      cnCountByOwnerFrom.r = cnCountByOwnerFrom.r.minus(BigInt.fromI32(1));
    } else if (cnInfo.rarity.equals(BigInt.fromI32(2))) {
      cnCountByOwnerFrom.sr = cnCountByOwnerFrom.sr.minus(BigInt.fromI32(1));
    } else if (cnInfo.rarity.equals(BigInt.fromI32(3))) {
      cnCountByOwnerFrom.ur = cnCountByOwnerFrom.ur.minus(BigInt.fromI32(1));
    } else {
      cnCountByOwnerFrom.mr = cnCountByOwnerFrom.mr.minus(BigInt.fromI32(1));
    }

    cnCountByOwnerFrom.save();

    let cnCountByOwnerTo = CnCountByOwner.load(event.params.to.toHex());
    if (!cnCountByOwnerTo) {
      cnCountByOwnerTo = new CnCountByOwner(event.params.to.toHex());
      cnCountByOwnerTo.owner = event.params.to;
    }

    cnCountByOwnerTo.total = cnCountByOwnerTo.total.plus(BigInt.fromI32(1));
    if (cnInfo.rarity.equals(BigInt.fromI32(1))) {
      cnCountByOwnerTo.r = cnCountByOwnerTo.r.plus(BigInt.fromI32(1));
    } else if (cnInfo.rarity.equals(BigInt.fromI32(2))) {
      cnCountByOwnerTo.sr = cnCountByOwnerTo.sr.plus(BigInt.fromI32(1));
    } else if (cnInfo.rarity.equals(BigInt.fromI32(3))) {
      cnCountByOwnerTo.ur = cnCountByOwnerTo.ur.plus(BigInt.fromI32(1));
    } else {
      cnCountByOwnerTo.mr = cnCountByOwnerTo.mr.plus(BigInt.fromI32(1));
    }

    cnCountByOwnerTo.save();
  }
}
