const db = require("../database/queries");

function homeGet(req, res) {
  res.render("home");
}

async function namesGet(req, res) {
  const items = await db.getAllItemsName();
  res.render("inventory", { items });
}

async function itemInfoGet(req, res) {
  const id = req.query.id;
  if (!id) {
    res.redirect("/inventory");
    return;
  }
  const item = await db.getItemInfo(id);
  if (item.length === 0) {
    res.status(404).send("Articulo no encontrado");
    return;
  }

  const flower = item[0];
  res.render("info", { flower });
}

async function itemInfoPost(req, res) {
  //todo Agregar token verification
  const id = req.query.id;
  const action = req.query.action;

  if (action === "edit") {
    return res.redirect(`/inventory/edit?id=${id}`);
  } else if (action === "delete") {
    const confirmation = await db.deleteItem(id);

    if (confirmation === 1) {
      return res.redirect("/inventory");
    } else {
      throw new Error("Id no reconocido");
    }
  }

  return res.redirect("/");
}

module.exports = {
  homeGet,
  namesGet,
  itemInfoGet,
  itemInfoPost,
};
