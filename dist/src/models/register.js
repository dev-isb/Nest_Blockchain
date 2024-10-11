"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.model = void 0;
const objection_1 = require("objection");
class model extends objection_1.Model {
    static get tableName() {
        return 'price';
    }
}
exports.model = model;
//# sourceMappingURL=register.js.map