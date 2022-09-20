function load(req, res) {
  return res.json(req.query)
}

function create(req, res) {
  return res.json(req.body)
}

module.exports = { load, create }
