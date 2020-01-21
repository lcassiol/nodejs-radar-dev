const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
  async index(request, response) {
    const { latitude, longitude, techs } = request.query;

    let query = {
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000
        }
      }
    };

    if (techs) {
      const techsArray = parseStringAsArray(techs);

      if (techsArray) {
        query.techs = {
          $in: new RegExp(`^${techsArray}$`, "i")
        };
      }
    }

    console.log(query);
    const devs = await Dev.find(query);

    return response.json(devs);
  }
};
