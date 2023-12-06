import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import ProfileHeader from '@/components/shared/ProfileHeader'
import Image from 'next/image'
import { profileTabs } from '@/constans'
import ThreadsTab from '@/components/shared/ThreadsTab'
import ThreadCard from '@/components/cards/ThreadCard'
import UserCard from '@/components/cards/UserCard'

const page = async () => {
	const user = await currentUser();
	if (!user) return null;

	const userInfo = await fetchUser(user.id);
	if (!userInfo?.onboarded) redirect("/onboarding");

	const result = await fetchUsers({
		userId: user.id,
		pageNumber: 1,
		pageSize: 25,
	});

	return (
		<section>
			<h1 className="head-text mb-10">Search</h1>

			{/* Search Bar */}

			<div className="mt-14 flex flex-col gap-9">
				{result.users.length === 0 ?(
					<p className="no-result">No User</p>
				) : (
					<>
						{result.users.map((person) => (
							<UserCard
								
							/>
						))}
					</>
				)}
			</div>
		</section>
	)
}

export default page