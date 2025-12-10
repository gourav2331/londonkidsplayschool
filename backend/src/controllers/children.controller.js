// For now, static data. Later we’ll fetch from Postgres.
const demoChildren = [
    { id: 1, name: 'Aarav', class: 'Playgroup' },
    { id: 2, name: 'Misha', class: 'Nursery' }
  ];
  
  const getChildren = async (req, res, next) => {
    try {
      // Later: query Postgres using pool
      res.json(demoChildren);
    } catch (err) {
      next(err);
    }
  };
  
  module.exports = {
    getChildren
  };
  