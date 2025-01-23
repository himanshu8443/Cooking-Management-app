import { Product } from "../models/Product";
import { Request, Response } from "express";


export async function createProduct(req: Request, res: Response) {
  try {
   const { dishName, quantity, isAddon, subscriberNotes, status } = req.body;
    const ownerId =
      req.user.accountType === "Admin" ? req.user.id : req.user.owner;
    if (!dishName || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Dish name and quantity are required",
      });
    }
    const product = await Product.create({
      owner: ownerId,
      dishName,
      quantity,
      isAddon,
      subscriberNotes,
      status,
    });
    return res.status(201).json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.log("error creating product", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the product",
    });
  }
}

export async function getProducts(req: Request, res: Response) {
  try {
    console.log("user", req.user);
    const owner =
      req.user.accountType === "Admin" ? req.user.id : req.user.owner;
    const products = await Product.find({ owner });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the products",
    });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const owner =
      req.user.accountType === "Admin" ? req.user.id : req.user.owner;
    const product = await Product.findOne({ _id: id, owner });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the product",
    });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { dishName, quantity, isAddon, subscriberNotes, status } = req.body;
    const ownerId =
      req.user.accountType === "Admin" ? req.user.id : req.user.owner;
    const product = await Product.findByIdAndUpdate(
      id,
      {
        dishName,
        quantity,
        isAddon,
        subscriberNotes,
        status,
      },
      { new: true }
    ).where("owner")
      .equals(ownerId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the product",
    });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const ownerId =
      req.user.accountType === "Admin" ? req.user.id : req.user.owner;
    const product = await Product.findByIdAndDelete(id)
      .where("owner")
      .equals(ownerId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the product",
    });
  }
}



export async function markAsCompleted(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const ownerId =
      req.user.accountType === "Admin" ? req.user.id : req.user.owner;
    const product = await Product.findByIdAndUpdate(
      id,
      {
        status: "Completed",
      },
      { new: true }
    ).where("owner")
      .equals(ownerId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    // return all products
    const products = await Product.find({ owner: ownerId });
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while marking the product as completed",
    });
  }
}


export async function removeCompletedProducts(req: Request, res: Response) {
  try {
    const ownerId =
      req.user.accountType === "Admin" ? req.user.id : req.user.owner;
    await Product.deleteMany({ owner: ownerId, status: "Completed" });
    const products = await Product.find({ owner: ownerId });
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while removing the completed products",
    });
  }
}

