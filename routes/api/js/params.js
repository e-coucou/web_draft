const tailwindConfig = require('/Users/rky/Documents/GitHub/web_draft/tailwind.config');
const express = require("express");
const router = express.Router();
router.use(express.json());

router.use(express.json());
router.get("/test", (req, res) => {
    res.status(200).json({val:'ok'});
});
router.get("/colors", (req, res) => {
    res.status(200).json(tailwindConfig.theme.extend.colors );
});


//-- Export module et fonctions
module.exports = router;