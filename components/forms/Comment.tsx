"use client"

import React from 'react'
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image"
import { addCommentToThread } from "@/lib/actions/thread.actions"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CommentValidation } from "@/lib/validations/thread";

interface Props {
	threadId: string;
	currentUserImg: string;
	currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
	const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname);

    form.reset();
  };
	return (
		<Form {...form}>
      <form
        className='comment-form'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full items-center gap-3'>
              <FormLabel>
                <Image
                	src={currentUserImg}
                	alt="Current user"
                	width={48}
                	height={48}
                	className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                	type="text"
                	placeholder="Comment..."
                	className="no-focus text-light-1 outline-none"
                	{...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type='submit' className='comment-form_btn'>
          Reply
        </Button>
      </form>
    </Form>
	)
}

export default Comment