const express = require("express");
const {
  getVehicleInfo,
  addVehicleInfo,
  deleteVehicleData,
  deleteAllVehicleData,
} = require("../../data/weightSQL");

const auth = require("../middleware/auth");
const router = express.Router();

router.get("/allvehicaldata", auth, async (req, res) => {
  try {
    const result = await getVehicleInfo();
    console.log(result);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        error: `An error occurred while fetching vehicle information.${error}`,
      });
  }
});


router.post("/addvehicaldata", auth, async (req, res) => {
  console.log("oist add vehical");
  try {
    const result = await addVehicleInfo(req.body);
    console.log(result);
    res.json(result);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({
        error: `An error occurred while Saving vehicle information.${error}`,
      });
  }
});

router.delete("/allvehicaldata", auth, async (req, res) => {
  try {
    const result = await deleteAllVehicleData();
    res.json(result);
  } catch (error) {
    res
      .status(400)
      .json({
        error: `An error occurred while deleting vehicle information.${error}`,
      });
  }
});

router.delete("/vehicaldata/:id", auth, async (req, res) => {
  try {
    const result = await deleteVehicleData(req.params.id);
    res.json(result);
  } catch (err) {
    res
      .status(400)
      .json({
        error: `An error occurred while deleting vehicle information.${error}`,
      });
  }
});
module.exports = router;
