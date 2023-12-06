"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose";

export async function fetchUser(userId: string) {
  try {
    connectToDB()

    return await User
      .findOne({ id: userId })
      // .populate({
      //   path: 'communities',
      //   model: Community
      // })
  }
  catch (error) {
    throw new Error(`Failed to fetch user : ${error.message}`)
  }
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB()

    // find all threads authored by user with the given userId

    // TODO: populate community
    const threads = await User.findOne({ id: userId })
      .populate({
        path: 'threads',
        model: Thread,
        populate: {
          path: 'children',
          model: Thread,
          populate: {
            path: 'author',
            model: User,
            select: 'name image id'
          }
        }
      })
    return threads
  }
  catch(error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`)
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc"
}: {
  userId: string,
  searchString?: string,
  pageNumber?: number,
  pageSize?: number,
  sortBy?: SortOrder
}) {
  try {
    connectToDB()

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i") // for searching insensitive regular expression
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }
    }

    if(searchString.trim() !== '') {
      query.$or = [
        { username: { $regex: regex } }
      ]
    }

    const sortOptions = { createdAt: sortBy }

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    const totalUsersCount = await User.countDocuments(query)

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length

    return { users, isNext };
  }
  catch(error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`)
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB()

    // find all threads created by the user
    const userThreads = await Thread.find({ author: userId })

    // collect all the child thread ids (replies) from the 'children' field
    const childThreadIds = userThreads.reduce((acc, userThread)/* fungsi reduce adalah fungsi untuk mengiterasi array userThreads.. diberikan dua parameter acc(accumulator) untuk mengumpulkan hasil yang terakumulasi dan userThread adalah setiap value yang ada dalam array dalam konteks ini dijadikan userThread */ => {
      return acc.concat(userThread.children); // concat adalah fungsi yang digunakan untuk menggabungkan dua buah array.. dalam baris kode ini menggabungkan array acc dengan array userThread.children menjadi satu array dalam childThreadIds
    }, [] /* array kosongnya adala default value yang kemudian akan diisi oleh fungsi didalamnya */) // singkatnya fungsi ini digunakan untuk mengambil semua objek yang ada pada children pada setiap objek pada userthreads tanpa mengambil thread aslinya

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id'
    })

    return replies;
  }
  catch(error: any) {
    throw new Error(`Failed to fetch activity: ${error.message}`)
  }
}