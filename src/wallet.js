"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nem_library_1 = require("nem-library");
const Observable_1 = require("rxjs/Observable");
const NETWORK = nem_library_1.NetworkTypes.MAIN_NET;
nem_library_1.NEMLibrary.bootstrap(NETWORK);
const mosaicSettings = require('./mosaic-settings.json');
const WALLET_NAME = mosaicSettings.wallet_name;
const namespace = mosaicSettings.mosaic_namespace;
const mosaicName = mosaicSettings.mosaic_name;
const mosaicId = new nem_library_1.MosaicId(namespace, mosaicName);
const mosaicHttp = new nem_library_1.MosaicHttp();
exports.getAccountBalances = (account) => {
    return new Promise((resolve, reject) => {
        const accountHttp = new nem_library_1.AccountHttp();
        accountHttp.getMosaicOwnedByAddress(account.address).subscribe(mosaics => {
            resolve(mosaics);
        }, error => {
            reject(error);
        });
    });
};
exports.mosaicBalance = (balances) => {
    const found = balances.find((mosaic) => {
        return mosaic.mosaicId.name === mosaicName;
    });
    if (!found)
        return 0;
    return found.quantity;
};
exports.xemBalance = (balances) => {
    const xemMosaic = balances.find((mosaic) => {
        return mosaic.mosaicId.name === 'xem';
    });
    if (!xemMosaic)
        return 0;
    return xemMosaic.quantity;
};
exports.createSimpleWallet = (password) => {
    const pass = new nem_library_1.Password(password);
    return nem_library_1.SimpleWallet.create(WALLET_NAME, pass);
};
exports.prepareTransfer = (toAddress, amount) => {
    return new Promise((resolve, reject) => {
        mosaicHttp.getMosaicTransferableWithAmount(mosaicId, amount)
            .subscribe(transferable => {
            resolve(nem_library_1.TransferTransaction.createWithMosaics(nem_library_1.TimeWindow.createWithDeadline(), new nem_library_1.Address(toAddress), [transferable], nem_library_1.EmptyMessage));
        }, error => {
            reject(error);
        });
    });
};
exports.sendMosaic = (toAddress, amount, account) => {
    return new Promise((resolve, reject) => {
        const transactionHttp = new nem_library_1.TransactionHttp();
        Observable_1.Observable.from([mosaicId])
            .flatMap(mosaic => mosaicHttp.getMosaicTransferableWithAmount(mosaic, amount))
            .toArray()
            .map(mosaics => nem_library_1.TransferTransaction.createWithMosaics(nem_library_1.TimeWindow.createWithDeadline(), new nem_library_1.Address(toAddress), mosaics, nem_library_1.EmptyMessage))
            .map(transaction => account.signTransaction(transaction))
            .flatMap(signed => transactionHttp.announceTransaction(signed))
            .subscribe(result => {
            resolve(result);
        }, error => {
            reject(error);
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid2FsbGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBR3FCO0FBQ3JCLGdEQUE2QztBQUU3QyxNQUFNLE9BQU8sR0FBRywwQkFBWSxDQUFDLFFBQVEsQ0FBQztBQUN0Qyx3QkFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUU5QixNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN6RCxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDO0FBQy9DLE1BQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNsRCxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDO0FBQzlDLE1BQU0sUUFBUSxHQUFHLElBQUksc0JBQVEsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDckQsTUFBTSxVQUFVLEdBQUcsSUFBSSx3QkFBVSxFQUFFLENBQUM7QUFFdkIsUUFBQSxrQkFBa0IsR0FBRyxDQUFDLE9BQWdCLEVBQTBCLEVBQUU7SUFDOUUsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyRCxNQUFNLFdBQVcsR0FBRyxJQUFJLHlCQUFXLEVBQUUsQ0FBQztRQUN0QyxXQUFXLENBQUMsdUJBQXVCLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN4RSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ1YsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVXLFFBQUEsYUFBYSxHQUFHLENBQUMsUUFBdUIsRUFBVSxFQUFFO0lB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QUNuQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ1YsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdEFjY291bnQsIEFkZHJlc3MsIEVtcHR5TWVzc2FnZSwgTW9zYWljSHR0cCwgTW9zYWljSWQsIE5FTUxpYnJhcnksIE5ldHdvcmtUeXBlcywgUGFzc3dvcmQsIFNpbXBsZVdhbGxldCwgVGltZVdpbmRvdyxcblx0VHJhbnNmZXJUcmFuc2FjdGlvbiwgQWNjb3VudEh0dHAsIE1vc2FpYywgVHJhbnNhY3Rpb25IdHRwLCBOZW1Bbm5vdW5jZVJlc3VsdFxufSBmcm9tICduZW0tbGlicmFyeSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcblxuY29uc3QgTkVUV09SSyA9IE5ldHdvcmtUeXBlcy5NQUlOX05FVDtcbk5FTUxpYnJhcnkuYm9vdHN0cmFwKE5FVFdPUkspO1xuXG5jb25zdCBtb3NhaWNTZXR0aW5ncyA9IHJlcXVpcmUoJy4vbW9zYWljLXNldHRpbmdzLmpzb24nKTtcbmNvbnN0IFdBTExFVF9OQU1FID0gbW9zYWljU2V0dGluZ3Mud2FsbGV0X25hbWU7XG5jb25zdCBuYW1lc3BhY2UgPSBtb3NhaWNTZXR0aW5ncy5tb3NhaWNfbmFtZXNwYWNlO1xuY29uc3QgbW9zYWljTmFtZSA9IG1vc2FpY1NldHRpbmdzLm1vc2FpY19uYW1lO1xuY29uc3QgbW9zYWljSWQgPSBuZXcgTW9zYWljSWQobmFtZXNwYWNlLCBtb3NhaWNOYW1lKTtcbmNvbnN0IG1vc2FpY0h0dHAgPSBuZXcgTW9zYWljSHR0cCgpO1xuXG5leHBvcnQgY29uc3QgZ2V0QWNjb3VudEJhbGFuY2VzID0gKGFjY291bnQ6IEFjY291bnQpOiBQcm9taXNlPEFycmF5PE1vc2FpYz4+ID0+IHtcblx0cmV0dXJuIG5ldyBQcm9taXNlPEFycmF5PE1vc2FpYz4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRjb25zdCBhY2NvdW50SHR0cCA9IG5ldyBBY2NvdW50SHR0cCgpO1xuXHRcdGFjY291bnRIdHRwLmdldE1vc2FpY093bmVkQnlBZGRyZXNzKGFjY291bnQuYWRkcmVzcykuc3Vic2NyaWJlKG1vc2FpY3MgPT4ge1xuXHRcdFx0cmVzb2x2ZShtb3NhaWNzKTtcblx0XHR9LCBlcnJvciA9PiB7XG5cdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdH0pO1xuXHR9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBtb3NhaWNCYWxhbmNlID0gKGJhbGFuY2VzOiBBcnJheTxNb3NhaWM+KTogbnVtYmVyID0+IHtcblx0Y29uc3QgZm91bmQgPSBiYWxhbmNlcy5maW5kKChtb3NhaWMpID0+IHtcblx0XHRyZXR1cm4gbW9zYWljLm1vc2FpY0lkLm5hbWUgPT09IG1vc2FpY05hbWVcblx0fSk7XG5cdGlmICghZm91bmQpIHJldHVybiAwO1xuXHRyZXR1cm4gZm91bmQucXVhbnRpdHk7XG59O1xuXG5leHBvcnQgY29uc3QgeGVtQmFsYW5jZSA9IChiYWxhbmNlczogQXJyYXk8TW9zYWljPik6IG51bWJlciA9PiB7XG5cdGNvbnN0IHhlbU1vc2FpYyA9IGJhbGFuY2VzLmZpbmQoKG1vc2FpYykgPT4ge1xuXHRcdHJldHVybiBtb3NhaWMubW9zYWljSWQubmFtZSA9PT0gJ3hlbSdcblx0fSk7XG5cdGlmICgheGVtTW9zYWljKSByZXR1cm4gMDtcblx0cmV0dXJuIHhlbU1vc2FpYy5xdWFudGl0eTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVTaW1wbGVXYWxsZXQ9IChwYXNzd29yZDogc3RyaW5nKTogU2ltcGxlV2FsbGV0ID0+IHtcblx0Y29uc3QgcGFzcyA9IG5ldyBQYXNzd29yZChwYXNzd29yZCk7XG5cdHJldHVybiBTaW1wbGVXYWxsZXQuY3JlYXRlKFdBTExFVF9OQU1FLCBwYXNzKTtcbn07XG5leHBvcnQgY29uc3QgcHJlcGFyZVRyYW5zZmVyID0gKHRvQWRkcmVzczogc3RyaW5nLCBhbW91bnQ6IG51bWJlcik6IFByb21pc2U8VHJhbnNmZXJUcmFuc2FjdGlvbj4gPT4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2U8VHJhbnNmZXJUcmFuc2FjdGlvbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0bW9zYWljSHR0cC5nZXRNb3NhaWNUcmFuc2ZlcmFibGVXaXRoQW1vdW50KG1vc2FpY0lkLCBhbW91bnQpXG5cdFx0XHRcdC5zdWJzY3JpYmUodHJhbnNmZXJhYmxlID0+IHtcblx0XHRcdFx0XHRyZXNvbHZlKFRyYW5zZmVyVHJhbnNhY3Rpb24uY3JlYXRlV2l0aE1vc2FpY3MoXG5cdFx0XHRcdFx0XHRUaW1lV2luZG93LmNyZWF0ZVdpdGhEZWFkbGluZSgpLFxuXHRcdFx0XHRcdFx0bmV3IEFkZHJlc3ModG9BZGRyZXNzKSxcblx0XHRcdFx0XHRcdFt0cmFuc2ZlcmFibGVdLFxuXHRcdFx0XHRcdFx0RW1wdHlNZXNzYWdlKSlcblx0XHRcdFx0fSwgZXJyb3IgPT4ge1xuXHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRcdH0pO1xuXHR9KTtcbn07XG5leHBvcnQgY29uc3Qgc2VuZE1vc2FpYyA9ICh0b0FkZHJlc3M6IHN0cmluZywgYW1vdW50OiBudW1iZXIsIGFjY291bnQ6IEFjY291bnQpOiBQcm9taXNlPE5lbUFubm91bmNlUmVzdWx0PiA9PiB7XG5cdHJldHVybiBuZXcgUHJvbWlzZTxOZW1Bbm5vdW5jZVJlc3VsdD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdGNvbnN0IHRyYW5zYWN0aW9uSHR0cCA9IG5ldyBUcmFuc2FjdGlvbkh0dHAoKTtcblx0XHRPYnNlcnZhYmxlLmZyb20oW21vc2FpY0lkXSlcblx0XHRcdC5mbGF0TWFwKG1vc2FpYyA9PiBtb3NhaWNIdHRwLmdldE1vc2FpY1RyYW5zZmVyYWJsZVdpdGhBbW91bnQobW9zYWljLCBhbW91bnQpKVxuXHRcdFx0LnRvQXJyYXkoKVxuXHRcdFx0Lm1hcChtb3NhaWNzID0+IFRyYW5zZmVyVHJhbnNhY3Rpb24uY3JlYXRlV2l0aE1vc2FpY3MoXG5cdFx0XHRcdFRpbWVXaW5kb3cuY3JlYXRlV2l0aERlYWRsaW5lKCksXG5cdFx0XHRcdG5ldyBBZGRyZXNzKHRvQWRkcmVzcyksXG5cdFx0XHRcdG1vc2FpY3MsXG5cdFx0XHRcdEVtcHR5TWVzc2FnZSkpXG5cdFx0XHQubWFwKHRyYW5zYWN0aW9uID0+IGFjY291bnQuc2lnblRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uKSlcblx0XHRcdC5mbGF0TWFwKHNpZ25lZCA9PiB0cmFuc2FjdGlvbkh0dHAuYW5ub3VuY2VUcmFuc2FjdGlvbihzaWduZWQpKVxuXHRcdFx0LnN1YnNjcmliZShyZXN1bHQgPT4ge1xuXHRcdFx0XHRyZXNvbHZlKHJlc3VsdCk7XG5cdFx0XHR9LCBlcnJvciA9PiB7XG5cdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHR9KTtcblx0fSk7XG59O1xuIl19