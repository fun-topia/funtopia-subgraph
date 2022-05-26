import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  BuyBoxes,
  Transfer
} from "../generated/CB/CB"
import { CbInfo, CbCount, CbCountByOwner } from "../generated/schema"

export function handleBuyBoxes(event: BuyBoxes): void {
  for (let i = 0; i < event.params.cbIds.length; i++) {
    let cbInfo = CbInfo.load(event.params.cbIds[i].toHex());
    if (!cbInfo) {
      cbInfo = new CbInfo(event.params.cbIds[i].toHex());
      cbInfo.cbId = event.params.cbIds[i];
    }

    cbInfo.owner = event.params.user;
    cbInfo.boxType = event.params.boxType;

    cbInfo.save();

    let cbCount = CbCount.load(BigInt.fromI32(0).toHex());
    if (!cbCount) {
      cbCount = new CbCount(BigInt.fromI32(0).toHex());
    }

    cbCount.total = cbCount.total.plus(BigInt.fromI32(1));
    if (cbInfo.boxType.equals(BigInt.fromI32(0))) {
      cbCount.t0 = cbCount.t0.plus(BigInt.fromI32(1));
    } else if (cbInfo.boxType.equals(BigInt.fromI32(1))) {
      cbCount.t1 = cbCount.t1.plus(BigInt.fromI32(1));
    } else if (cbInfo.boxType.equals(BigInt.fromI32(2))) {
      cbCount.t2 = cbCount.t2.plus(BigInt.fromI32(1));
    } else if (cbInfo.boxType.equals(BigInt.fromI32(3))) {
      cbCount.t3 = cbCount.t3.plus(BigInt.fromI32(1));
    } else {
      cbCount.t4 = cbCount.t4.plus(BigInt.fromI32(1));
    }

    cbCount.save();

    let cbCountByOwner = CbCountByOwner.load(event.params.user.toHex());
    if (!cbCountByOwner) {
      cbCountByOwner = new CbCountByOwner(event.params.user.toHex());
      cbCountByOwner.owner = event.params.user;
    }

    cbCountByOwner.total = cbCountByOwner.total.plus(BigInt.fromI32(1));
    if (cbInfo.boxType.equals(BigInt.fromI32(0))) {
      cbCountByOwner.t0 = cbCountByOwner.t0.plus(BigInt.fromI32(1));
    } else if (cbInfo.boxType.equals(BigInt.fromI32(1))) {
      cbCountByOwner.t1 = cbCountByOwner.t1.plus(BigInt.fromI32(1));
    } else if (cbInfo.boxType.equals(BigInt.fromI32(2))) {
      cbCountByOwner.t2 = cbCountByOwner.t2.plus(BigInt.fromI32(1));
    } else if (cbInfo.boxType.equals(BigInt.fromI32(3))) {
      cbCountByOwner.t3 = cbCountByOwner.t3.plus(BigInt.fromI32(1));
    } else {
      cbCountByOwner.t4 = cbCountByOwner.t4.plus(BigInt.fromI32(1));
    }

    cbCountByOwner.save();
  }
}

export function handleTransfer(event: Transfer): void {
  if (event.params.from.notEqual(Address.zero())) {
    let cbInfo = CbInfo.load(event.params.tokenId.toHex());
    if (!cbInfo) {
      cbInfo = new CbInfo(event.params.tokenId.toHex());
      cbInfo.cbId = event.params.tokenId;
    }

    cbInfo.owner = event.params.to;

    cbInfo.save();

    let cbCountByOwnerFrom = CbCountByOwner.load(event.params.from.toHex());
    if (!cbCountByOwnerFrom) {
      cbCountByOwnerFrom = new CbCountByOwner(event.params.from.toHex());
      cbCountByOwnerFrom.owner = event.params.from;
    }

    cbCountByOwnerFrom.total = cbCountByOwnerFrom.total.minus(BigInt.fromI32(1));
    if (cbInfo.boxType.equals(BigInt.fromI32(0))) {
      cbCountByOwnerFrom.t0 = cbCountByOwnerFrom.t0.minus(BigInt.fromI32(1));
    } else if (cbInfo.boxType.equals(BigInt.fromI32(1))) {
      cbCountByOwnerFrom.t1 = cbCountByOwnerFrom.t1.minus(BigInt.fromI32(1));
    } else if (cbInfo.boxType.equals(BigInt.fromI32(2))) {
      cbCountByOwnerFrom.t2 = cbCountByOwnerFrom.t2.minus(BigInt.fromI32(1));
    } else if (cbInfo.boxType.equals(BigInt.fromI32(3))) {
      cbCountByOwnerFrom.t3 = cbCountByOwnerFrom.t3.minus(BigInt.fromI32(1));
    } else {
      cbCountByOwnerFrom.t4 = cbCountByOwnerFrom.t4.minus(BigInt.fromI32(1));
    }

    cbCountByOwnerFrom.save();

    let cbCountByOwnerTo = CbCountByOwner.load(event.params.to.toHex());
    if (!cbCountByOwnerTo) {
      cbCountByOwnerTo = new CbCountByOwner(event.params.to.toHex());
      cbCountByOwnerTo.owner = event.params.to;
    }

    cbCountByOwnerTo.total = cbCountByOwnerTo.total.plus(BigInt.fromI32(1));
    if (cbInfo.boxType.equals(BigInt.fromI32(0))) {
      cbCountByOwnerTo.t0 = cbCountByOwnerTo.t0.plus(BigInt.fromI32(1));
    } else if (cbInfo.boxType.equals(BigInt.fromI32(1))) {
      cbCountByOwnerTo.t1 = cbCountByOwnerTo.t1.plus(BigInt.fromI32(1));
    } else if (cbInfo.boxType.equals(BigInt.fromI32(2))) {
      cbCountByOwnerTo.t2 = cbCountByOwnerTo.t2.plus(BigInt.fromI32(1));
    } else if (cbInfo.boxType.equals(BigInt.fromI32(3))) {
      cbCountByOwnerTo.t3 = cbCountByOwnerTo.t3.plus(BigInt.fromI32(1));
    } else {
      cbCountByOwnerTo.t4 = cbCountByOwnerTo.t4.plus(BigInt.fromI32(1));
    }

    cbCountByOwnerTo.save();
  }
}
