var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { NativeModules, NativeEventEmitter, Platform } from "react-native";
import * as EPToolkit from "./utils/EPToolkit";
import { processColumnText } from './utils/print-column';
import PRINTER_COMMANDS from './utils/printer-commands';
var RNUSBPrinter = NativeModules.RNUSBPrinter;
var RNBLEPrinter = NativeModules.RNBLEPrinter;
var RNNetPrinter = NativeModules.RNNetPrinter;
export var COMMANDS = PRINTER_COMMANDS;
export var ColumnAliment;
(function (ColumnAliment) {
    ColumnAliment[ColumnAliment["LEFT"] = 0] = "LEFT";
    ColumnAliment[ColumnAliment["CENTER"] = 1] = "CENTER";
    ColumnAliment[ColumnAliment["RIGHT"] = 2] = "RIGHT";
})(ColumnAliment || (ColumnAliment = {}));
var textTo64Buffer = function (text, opts) {
    var defaultOptions = {
        beep: false,
        cut: false,
        tailingLine: false,
        encoding: "UTF8",
    };
    var options = __assign(__assign({}, defaultOptions), opts);
    var fixAndroid = '\n';
    var buffer = EPToolkit.exchange_text(text + fixAndroid, options);
    return buffer.toString("base64");
};
var billTo64Buffer = function (text, opts) {
    var defaultOptions = {
        beep: true,
        cut: true,
        encoding: "UTF8",
        tailingLine: true,
    };
    var options = __assign(__assign({}, defaultOptions), opts);
    var buffer = EPToolkit.exchange_text(text, options);
    return buffer.toString("base64");
};
var textPreprocessingIOS = function (text, canCut, beep) {
    if (canCut === void 0) { canCut = true; }
    if (beep === void 0) { beep = true; }
    var options = {
        beep: beep,
        cut: canCut,
    };
    return {
        text: text
            .replace(/<\/?CB>/g, "")
            .replace(/<\/?CM>/g, "")
            .replace(/<\/?CD>/g, "")
            .replace(/<\/?C>/g, "")
            .replace(/<\/?D>/g, "")
            .replace(/<\/?B>/g, "")
            .replace(/<\/?M>/g, ""),
        opts: options,
    };
};
// const imageToBuffer = async (imagePath: string, threshold: number = 60) => {
//   const buffer = await EPToolkit.exchange_image(imagePath, threshold);
//   return buffer.toString("base64");
// };
export var USBPrinter = {
    init: function () {
        return new Promise(function (resolve, reject) {
            return RNUSBPrinter.init(function () { return resolve(); }, function (error) { return reject(error); });
        });
    },
    getDeviceList: function () {
        return new Promise(function (resolve, reject) {
            return RNUSBPrinter.getDeviceList(function (printers) { return resolve(printers); }, function (error) { return reject(error); });
        });
    },
    connectPrinter: function (vendorId, productId) {
        return new Promise(function (resolve, reject) {
            return RNUSBPrinter.connectPrinter(vendorId, productId, function (printer) { return resolve(printer); }, function (error) { return reject(error); });
        });
    },
    closeConn: function () {
        return new Promise(function (resolve) {
            RNUSBPrinter.closeConn();
            resolve();
        });
    },
    printText: function (text, opts) {
        if (opts === void 0) { opts = {}; }
        return RNUSBPrinter.printRawData(textTo64Buffer(text, opts), function (error) {
            return console.warn(error);
        });
    },
    printBill: function (text, opts) {
        if (opts === void 0) { opts = {}; }
        return RNUSBPrinter.printRawData(billTo64Buffer(text, opts), function (error) {
            return console.warn(error);
        });
    },
    /**
     * image url
     * @param imgUrl
     * @param opts
     */
    printImage: function (imgUrl, opts) {
        if (opts === void 0) { opts = {}; }
        if (Platform.OS === "ios") {
            RNUSBPrinter.printImageData(imgUrl, opts, function (error) { return console.warn(error); });
        }
        else {
            RNUSBPrinter.printImageData(imgUrl, function (error) { return console.warn(error); });
        }
    },
    /**
     * base64string, except -> data:image/png;base64,
     * @param qrCodeBase64
     * @param opts
     */
    printQrCode: function (qrCodeBase64, opts) {
        if (opts === void 0) { opts = {}; }
        if (Platform.OS === "ios") {
            RNUSBPrinter.printQrCode(qrCodeBase64, opts, function (error) { return console.warn(error); });
        }
        else {
            RNUSBPrinter.printQrCode(qrCodeBase64, function (error) { return console.warn(error); });
        }
    },
    /**
     * android print with encoder
     * @param text
     */
    printRaw: function (text) {
        if (Platform.OS === "ios") {
        }
        else {
            RNUSBPrinter.printRawData(text, function (error) {
                return console.warn(error);
            });
        }
    },
    /**
     * `columnWidth`
     * 80mm => 46 character
     * 58mm => 30 character
     */
    printColumnsText: function (texts, columnWidth, columnAliment, columnStyle, opts) {
        if (opts === void 0) { opts = {}; }
        var result = processColumnText(texts, columnWidth, columnAliment, columnStyle);
        RNUSBPrinter.printRawData(textTo64Buffer(result, opts), function (error) {
            return console.warn(error);
        });
    },
};
export var BLEPrinter = {
    init: function () {
        return new Promise(function (resolve, reject) {
            return RNBLEPrinter.init(function () { return resolve(); }, function (error) { return reject(error); });
        });
    },
    getDeviceList: function () {
        return new Promise(function (resolve, reject) {
            return RNBLEPrinter.getDeviceList(function (printers) { return resolve(printers); }, function (error) { return reject(error); });
        });
    },
    connectPrinter: function (inner_mac_address) {
        return new Promise(function (resolve, reject) {
            return RNBLEPrinter.connectPrinter(inner_mac_address, function (printer) { return resolve(printer); }, function (error) { return reject(error); });
        });
    },
    closeConn: function () {
        return new Promise(function (resolve) {
            RNBLEPrinter.closeConn();
            resolve();
        });
    },
    printText: function (text, opts) {
        if (opts === void 0) { opts = {}; }
        if (Platform.OS === "ios") {
            var processedText = textPreprocessingIOS(text, false, false);
            RNBLEPrinter.printRawData(processedText.text, processedText.opts, function (error) { return console.warn(error); });
        }
        else {
            RNBLEPrinter.printRawData(textTo64Buffer(text, opts), function (error) {
                return console.warn(error);
            });
        }
    },
    printBill: function (text, opts) {
        var _a, _b;
        if (opts === void 0) { opts = {}; }
        if (Platform.OS === "ios") {
            var processedText = textPreprocessingIOS(text, (_a = opts === null || opts === void 0 ? void 0 : opts.cut) !== null && _a !== void 0 ? _a : true, (_b = opts.beep) !== null && _b !== void 0 ? _b : true);
            RNBLEPrinter.printRawData(processedText.text, processedText.opts, function (error) { return console.warn(error); });
        }
        else {
            RNBLEPrinter.printRawData(billTo64Buffer(text, opts), function (error) {
                return console.warn(error);
            });
        }
    },
    /**
     * image url
     * @param imgUrl
     * @param opts
     */
    printImage: function (imgUrl, opts) {
        if (opts === void 0) { opts = {}; }
        if (Platform.OS === "ios") {
            /**
             * just development
             */
            RNBLEPrinter.printImageData(imgUrl, opts, function (error) { return console.warn(error); });
        }
        else {
            RNBLEPrinter.printImageData(imgUrl, function (error) { return console.warn(error); });
        }
    },
    /**
     * base64string, except -> data:image/png;base64,
     * @param qrCodeBase64
     * @param opts
     */
    printQrCode: function (qrCodeBase64, opts) {
        if (opts === void 0) { opts = {}; }
        if (Platform.OS === "ios") {
            /**
             * just development
             */
            RNBLEPrinter.printQrCode(qrCodeBase64, opts, function (error) { return console.warn(error); });
        }
        else {
            /**
             * just development
             */
            RNBLEPrinter.printQrCode(qrCodeBase64, function (error) { return console.warn(error); });
        }
    },
    /**
     * android print with encoder
     * @param text
     */
    printRaw: function (text) {
        if (Platform.OS === "ios") {
        }
        else {
            RNBLEPrinter.printRawData(text, function (error) {
                return console.warn(error);
            });
        }
    },
    /**
     * `columnWidth`
     * 80mm => 46 character
     * 58mm => 30 character
     */
    printColumnsText: function (texts, columnWidth, columnAliment, columnStyle, opts) {
        if (opts === void 0) { opts = {}; }
        var result = processColumnText(texts, columnWidth, columnAliment, columnStyle);
        if (Platform.OS === "ios") {
            var processedText = textPreprocessingIOS(result, false, false);
            RNBLEPrinter.printRawData(processedText.text, processedText.opts, function (error) { return console.warn(error); });
        }
        else {
            RNBLEPrinter.printRawData(textTo64Buffer(result, opts), function (error) {
                return console.warn(error);
            });
        }
    },
};
export var NetPrinter = {
    init: function () {
        return new Promise(function (resolve, reject) {
            return RNNetPrinter.init(function () { return resolve(); }, function (error) { return reject(error); });
        });
    },
    getDeviceList: function () {
        return new Promise(function (resolve, reject) {
            return RNNetPrinter.getDeviceList(function (printers) { return resolve(printers); }, function (error) { return reject(error); });
        });
    },
    connectPrinter: function (host, port) {
        return new Promise(function (resolve, reject) {
            return RNNetPrinter.connectPrinter(host, port, function (printer) { return resolve(printer); }, function (error) { return reject(error); });
        });
    },
    closeConn: function () {
        return new Promise(function (resolve) {
            RNNetPrinter.closeConn();
            resolve();
        });
    },
    printText: function (text, opts) {
        if (opts === void 0) { opts = {}; }
        if (Platform.OS === "ios") {
            var processedText = textPreprocessingIOS(text, false, false);
            RNNetPrinter.printRawData(processedText.text, processedText.opts, function (error) { return console.warn(error); });
        }
        else {
            RNNetPrinter.printRawData(textTo64Buffer(text, opts), function (error) {
                return console.warn(error);
            });
        }
    },
    printBill: function (text, opts) {
        var _a, _b;
        if (opts === void 0) { opts = {}; }
        if (Platform.OS === "ios") {
            var processedText = textPreprocessingIOS(text, (_a = opts === null || opts === void 0 ? void 0 : opts.cut) !== null && _a !== void 0 ? _a : true, (_b = opts.beep) !== null && _b !== void 0 ? _b : true);
            RNNetPrinter.printRawData(processedText.text, processedText.opts, function (error) { return console.warn(error); });
        }
        else {
            RNNetPrinter.printRawData(billTo64Buffer(text, opts), function (error) {
                return console.warn(error);
            });
        }
    },
    /**
     * image url
     * @param imgUrl
     * @param opts
     */
    printImage: function (imgUrl, opts) {
        if (opts === void 0) { opts = {}; }
        if (Platform.OS === "ios") {
            RNNetPrinter.printImageData(imgUrl, opts, function (error) { return console.warn(error); });
        }
        else {
            RNNetPrinter.printImageData(imgUrl, function (error) { return console.warn(error); });
        }
    },
    /**
     * base64string, except -> data:image/png;base64,
     * @param qrCodeBase64
     * @param opts
     */
    printQrCode: function (qrCodeBase64, opts) {
        if (opts === void 0) { opts = {}; }
        if (Platform.OS === "ios") {
            RNNetPrinter.printQrCode(qrCodeBase64, opts, function (error) { return console.warn(error); });
        }
        else {
            RNNetPrinter.printQrCode(qrCodeBase64, function (error) { return console.warn(error); });
        }
    },
    /**
     * Android print with encoder
     * @param text
     */
    printRaw: function (text) {
        if (Platform.OS === "ios") {
        }
        else {
            RNNetPrinter.printRawData(text, function (error) {
                return console.warn(error);
            });
        }
    },
    /**
     * `columnWidth`
     * 80mm => 46 character
     * 58mm => 30 character
     */
    printColumnsText: function (texts, columnWidth, columnAliment, columnStyle, opts) {
        if (columnStyle === void 0) { columnStyle = []; }
        if (opts === void 0) { opts = {}; }
        var result = processColumnText(texts, columnWidth, columnAliment, columnStyle);
        if (Platform.OS === "ios") {
            var processedText = textPreprocessingIOS(result, false, false);
            RNNetPrinter.printRawData(processedText.text, processedText.opts, function (error) { return console.warn(error); });
        }
        else {
            RNNetPrinter.printRawData(textTo64Buffer(result, opts), function (error) {
                return console.warn(error);
            });
        }
    },
};
export var NetPrinterEventEmitter = new NativeEventEmitter(RNNetPrinter);
export var RN_THERMAL_RECEIPT_PRINTER_EVENTS;
(function (RN_THERMAL_RECEIPT_PRINTER_EVENTS) {
    RN_THERMAL_RECEIPT_PRINTER_EVENTS["EVENT_NET_PRINTER_SCANNED_SUCCESS"] = "scannerResolved";
    RN_THERMAL_RECEIPT_PRINTER_EVENTS["EVENT_NET_PRINTER_SCANNING"] = "scannerRunning";
    RN_THERMAL_RECEIPT_PRINTER_EVENTS["EVENT_NET_PRINTER_SCANNED_ERROR"] = "registerError";
})(RN_THERMAL_RECEIPT_PRINTER_EVENTS || (RN_THERMAL_RECEIPT_PRINTER_EVENTS = {}));
