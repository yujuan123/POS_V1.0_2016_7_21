'use strict';

let tags =[
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2.5',
  'ITEM000005',
  'ITEM000005-2',
];

function formatTags(tags)
{
  return tags.map(function (tag){
      let temp=tag.split("-");
      return {barcode:temp[0],amount:parseFloat(temp[1])||1};
    }

  );
}
console.log(formatTags(tags));

function mergeBarcodes(barcodes)
{

  let mergeBarcodes=[];
  for(let i=0;i<barcodes.length;i++)
  {
    let item=mergeBarcodes.find(function (it) {
        return it.barcode===barcodes[i].barcode;
      }

    );
    if(item)
    {
      item.amount+=barcodes[i].amount;
    }
    else {
      mergeBarcodes.push(Object.assign({},{barcode:barcodes[i].barcode},{amount:barcodes[i].amount}));
    }
  }
  return mergeBarcodes;
}

console.log(mergeBarcodes(formatTags(tags)));

function getCartItems(allItems,barcodesItem)
{
  let cartItems=[];

  for(let i=0;i<allItems.length;i++)
  {
    let existItems=barcodesItem.find(function (item) {
        return item.barcode===allItems[i].barcode;
      }

    )
    if(existItems){
        cartItems.push(Object.assign({},allItems[i],{amount:existItems.amount}));
    }

  }
  return cartItems;
}
console.log(getCartItems(loadAllItems(),mergeBarcodes(formatTags(tags))));

let x1=getCartItems(loadAllItems(),mergeBarcodes(formatTags(tags)));
//先计算小计
function calculateSubtotal(cartItems) {
  let subtotal=[];
  let subtotalItems=[];

  for(let i=0;i<cartItems.length;i++)
  {


    subtotal[i]=cartItems[i].amount*(cartItems[i].price);


    subtotalItems.push(Object.assign({},cartItems[i],{subtotal:subtotal[i]}));
  }

  return subtotalItems;
}

console.log(calculateSubtotal(x1));

//优惠了多少
function calculateSaving(subtotalItems,allPromotionItems) {
  let savingItems=[];
  let tempArray=allPromotionItems[0].barcodes;
  for(let i=0;i<subtotalItems.length;i++){



    let existItem=tempArray.find(function(item){
      return item===subtotalItems[i].barcode;
    });
    if(existItem){
      let temp=Math.floor((subtotalItems[i].amount)/3)*(subtotalItems[i].price);
      savingItems.push(Object.assign({},subtotalItems[i],{saving:temp}));
    }
    else {
      savingItems.push(Object.assign({},subtotalItems[i],{saving:0}));
    }
  }
  return savingItems;
}
console.log(calculateSaving(calculateSubtotal(x1),loadPromotions()));

//新的小计
function getSubtotal(savingItems){
  //
  return savingItems.map(function (item) {
    item.subtotal=item.subtotal-item.saving;
    return item;
  })
}
let x2=calculateSaving(calculateSubtotal(x1),loadPromotions());
console.log(getSubtotal(x2));

function getTotal(savedItems) {
  let total=0;
  for(let i=0;i<savedItems.length;i++){
    total+=savedItems[i].subtotal;
  }
  return total;
}
let x3=getSubtotal(x2);
//console.log(x3);
console.log(getTotal(x3));

function getSaving(savedItems){
  let allSaving=0;
  for(let i=0;i<savedItems.length;i++){
    allSaving+=savedItems[i].saving;
  }
  return allSaving;
}
console.log(getSaving(x3));

function print(savedItems,total,allSaving)
{
  //注意 `` 的使用
  let receiptText=savedItems.map(function (item) {
    return `名称 : ${item.name}，
    数量 : ${item.amount}${item.unit},
    单价 : ${formatMoney(item.price)}(元),
    小计 : ${formatMoney(item.subtotal)}(元)`
  })
    .join('\n');

    return `***<没钱赚商店>收据***
${receiptText}
----------------------
总计：${formatMoney(total)}(元)
节省：${formatMoney(allSaving)} (元)
**********************`

}


function formatMoney(money){
  return money.toFixed(2);
}
console.log(print(x3,getTotal(x3),getSaving(x3)));
