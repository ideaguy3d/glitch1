const cors = require('cors')({ origin: true });

module.exports = (app, db) => {
  app.post('/api/v1/club', (req, res) => {
    cors(req, res, async () => {
      try {
       
        const {
          name,
          about,
          topDrinks,
          address,
          webSite,
          phoneNo,
          hoursOfOperation,
        } = req.body;
        
        const data = {
          name,
          about,
          topDrinks,
          address,
          webSite,
          phoneNo,
          hoursOfOperation,
        };

        // const clubRef = await db.collection('clubs').add(data);
        // const club = await clubRef.get();
        // const ref = db.ref('clubs');
        // const clubsRef = ref.child("users");



        console.log('clubRef', clubRef);
        console.log('club', club);
        res.json({
          id: clubRef.id,
          data: club.data(),
        });
      } catch (err) {
        console.log({err})
        res.status(500).send(err);
      }
    });
  });
};
