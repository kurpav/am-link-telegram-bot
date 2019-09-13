const { JSDOM } = require("jsdom");
const request = require("request");

exports.getSongMetadata = url => {
  return new Promise((resolve, reject) => {
    request({ url }, function(error, response, body) {
      if (error) {
        reject(error);
        return;
      }

      // TODO: handle query params locale `l=uk`
      const dom = new JSDOM(body);
      const title = dom.window.document.querySelector("title").textContent;
      const name = title.split("by")[0].trim();
      const artist = title
        .split("by")[1]
        .split("on")[0]
        .trim();
      resolve({
        name,
        artist
      });
    });
  });
};
