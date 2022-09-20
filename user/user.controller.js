function load(req, res) {
  return res.json(req.query)
}

module.exports = { load }
