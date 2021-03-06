import { store, BigInt, Address } from '@graphprotocol/graph-ts'
import { Market, Buy, Cancel, Sell } from '../generated/Market/Market'
import { CB } from '../../cybergear-box/generated/CB/CB'
import { CN } from '../../cybergear-nft/generated/CN/CN'
import { BuyInfo, SellInfo, Counter } from '../generated/schema'

const cbAddr = Address.fromString('0xD44834B07A61D032Fbef14d5Cc0C4585159dD753');
const cnAddr = Address.fromString('0x2432e8dD4202C09aF83F7f20b1f09378349179cb');

const heroToRarity = [1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4];

export function handleBuy(event: Buy): void {
  for (let i = 0; i < event.params.nftIds.length; i++) {
    let buyInfo = BuyInfo.load(event.transaction.hash.toHex() + '-' + event.logIndex.toString() + '-' + event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
    if (!buyInfo) {
      buyInfo = new BuyInfo(event.transaction.hash.toHex() + '-' + event.logIndex.toString() + '-' + event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
      buyInfo.nft = event.params.nfts[i];
      buyInfo.nftId = event.params.nftIds[i];
    }
    const market = Market.bind(event.address);
    const cb = CB.bind(cbAddr);
    const cn = CN.bind(cnAddr);

    buyInfo.buyer = event.params.buyer;
    buyInfo.seller = event.params.sellers[i];
    buyInfo.token = event.params.tokens[i];
    buyInfo.price = event.params.prices[i];
    buyInfo.fee = market.fee();
    buyInfo.feeAmount = buyInfo.price.times(buyInfo.fee).div(BigInt.fromI32(10000));
    buyInfo.sellAmount = buyInfo.price.minus(buyInfo.feeAmount);
    buyInfo.buyTime = event.block.timestamp;

    if (buyInfo.nft == cbAddr) {
      buyInfo.boxType = cb.cbIdToType(buyInfo.nftId);
    }

    if (buyInfo.nft == cnAddr) {
      buyInfo.hero = cn.data(buyInfo.nftId, 'hero');
      buyInfo.rarity = BigInt.fromI32(heroToRarity[buyInfo.hero.toI32() - 1]);
    }

    buyInfo.save();

    let counter = Counter.load(buyInfo.nft.toHex() + '-' + buyInfo.token.toHex());
    if (!counter) {
      counter = new Counter(buyInfo.nft.toHex() + '-' + buyInfo.token.toHex());
      counter.nft = buyInfo.nft;
      counter.token = buyInfo.token;
    }

    counter.transactions = counter.transactions.plus(BigInt.fromI32(1));
    counter.volume = counter.volume.plus(buyInfo.price);
    counter.items = counter.items.minus(BigInt.fromI32(1));

    counter.save();

    store.remove('SellInfo', event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
  }
}

export function handleCancel(event: Cancel): void {
  for (let i = 0; i < event.params.nftIds.length; i++) {
    let sellInfo = SellInfo.load(event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
    if (!sellInfo) {
      sellInfo = new SellInfo(event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
      sellInfo.nft = event.params.nfts[i];
      sellInfo.nftId = event.params.nftIds[i];
    }

    let counter = Counter.load(sellInfo.nft.toHex() + '-' + sellInfo.token.toHex());
    if (!counter) {
      counter = new Counter(sellInfo.nft.toHex() + '-' + sellInfo.token.toHex());
      counter.nft = sellInfo.nft;
      counter.token = sellInfo.token;
    }

    counter.items = counter.items.minus(BigInt.fromI32(1));

    counter.save();

    store.remove('SellInfo', event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
  }
}

export function handleSell(event: Sell): void {
  for (let i = 0; i < event.params.nftIds.length; i++) {
    let sellInfo = SellInfo.load(event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
    if (!sellInfo) {
      sellInfo = new SellInfo(event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
      sellInfo.nft = event.params.nfts[i];
      sellInfo.nftId = event.params.nftIds[i];
    }
    const cb = CB.bind(cbAddr);
    const cn = CN.bind(cnAddr);

    sellInfo.seller = event.params.seller;
    sellInfo.token = event.params.tokens[i];
    sellInfo.price = event.params.prices[i];
    sellInfo.sellTime = event.block.timestamp;

    if (sellInfo.nft == cbAddr) {
      sellInfo.boxType = cb.cbIdToType(sellInfo.nftId);
    }

    if (sellInfo.nft == cnAddr) {
      sellInfo.hero = cn.data(sellInfo.nftId, 'hero');
      sellInfo.rarity = BigInt.fromI32(heroToRarity[sellInfo.hero.toI32() - 1]);
    }

    sellInfo.save();

    let counter = Counter.load(sellInfo.nft.toHex() + '-' + sellInfo.token.toHex());
    if (!counter) {
      counter = new Counter(sellInfo.nft.toHex() + '-' + sellInfo.token.toHex());
      counter.nft = sellInfo.nft;
      counter.token = sellInfo.token;
    }

    counter.items = counter.items.plus(BigInt.fromI32(1));

    counter.save();
  }
}