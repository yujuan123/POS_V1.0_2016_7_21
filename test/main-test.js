'use strict';
//it yao gai
describe("formatTags",function () {
  it("should return barcode and count",function () {
    let tempArray=["ITEM000001"];
    let result=formatTags(tempArray);
    expect(result).toEqual([{barcode:"ITEM000001",amount:1}]);
  })
});

describe("mergeBarcodes",function () {
  it("should return merged items",function () {
    let tempArray=["ITEM000001","ITEM000001","ITEM000001"];
    let result=mergeBarcodes(formatTags(tempArray));
    expect(result).toEqual([{barcode:"ITEM000001",amount:3}]);
  })
});

describe("getCartItems",function () {
  it("should return cart items",function () {
    let tempArray=["ITEM000001"];
    let temp=mergeBarcodes(formatTags(tempArray));
    let result=getCartItems(loadAllItems(),temp);
    expect(result).toEqual([{barcode:"ITEM000001",name:
        "雪碧",
      price:3,unit:"瓶",amount:1}]);
  })
});

describe("calculateSubtotal",function () {
  it("should return cart items",function () {
    let tempArray=["ITEM000001"];
    let temp=mergeBarcodes(formatTags(tempArray));
    let result=calculateSubtotal(getCartItems(loadAllItems(),temp));
    expect(result).toEqual([{barcode:"ITEM000001",name:
      "雪碧",
      price:3,unit:"瓶",amount:1,subtotal:3}]);
  })
});


describe("calculateSaving",function () {
  it("should return cart items",function () {
    let tempArray=["ITEM000001"];
    let temp=mergeBarcodes(formatTags(tempArray));
    let result=calculateSaving(calculateSubtotal(getCartItems(loadAllItems(),temp)),loadPromotions());
    expect(result).toEqual([{barcode:"ITEM000001",name:
      "雪碧",
      price:3,unit:"瓶",amount:1,subtotal:3,saving:0}]);
  })
});


describe("getSubtotal",function () {
  it("should return cart items",function () {
    let tempArray=["ITEM000001"];
    let temp=mergeBarcodes(formatTags(tempArray));
    let temp2=calculateSaving(calculateSubtotal(getCartItems(loadAllItems(),temp)),loadPromotions());
    let result=getSubtotal(temp2);
    expect(result).toEqual([{barcode:"ITEM000001",name:
      "雪碧",
      price:3,unit:"瓶",amount:1,subtotal:3,saving:0}]);
  })
});

describe("getTotal",function () {
  it("should return cart items",function () {
    let tempArray=["ITEM000001"];
    let temp=mergeBarcodes(formatTags(tempArray));
    let temp2=calculateSaving(calculateSubtotal(getCartItems(loadAllItems(),temp)),loadPromotions());
    let result=getTotal(temp2);
    expect(result).toBe(3);
  })
});

describe("getSaving",function () {
  it("should return cart items",function () {
    let tempArray=["ITEM000001"];
    let temp=mergeBarcodes(formatTags(tempArray));
    let temp2=calculateSaving(calculateSubtotal(getCartItems(loadAllItems(),temp)),loadPromotions());
    let result=getSaving(temp2);
    expect(result).toBe(0);
  })
});

describe('pos', () => {

  it('should print text', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});
