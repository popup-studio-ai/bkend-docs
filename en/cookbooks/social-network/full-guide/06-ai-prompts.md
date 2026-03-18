# 06. AI Prompt Collection

{% hint style="info" %}
💡 A prompt reference for requesting each feature of the social network project from the AI in natural language. Use the prompts below as-is with your MCP connection set up.
{% endhint %}

## What This Chapter Covers

- Table creation/schema management prompts
- Profile CRUD prompts
- Post, comment, and like prompts
- Follow/unfollow prompts
- Feed query and filtering prompts
- Complex scenario prompts

***

## Basic Design Reference

When you ask the AI to create tables, verify that it suggests structures similar to the ones below.

### profiles (User Profiles)

| Field | Description | Example Value |
|-------|-------------|---------------|
| nickname | Nickname | "CodingKim" |
| bio | Bio | "I love coding" |
| avatarUrl | Profile picture URL | (linked after upload) |
| userId | User identifier | (user ID) |

### posts (Posts)

| Field | Description | Example Value |
|-------|-------------|---------------|
| content | Post content | "Nice weather today" |
| imageUrl | Attached image URL | (linked after upload) |
| likesCount | Likes count | 0 |
| commentsCount | Comments count | 0 |

### comments (Comments)

| Field | Description | Example Value |
|-------|-------------|---------------|
| postId | Post to comment on | (post ID) |
| content | Comment content | "I agree with you" |

### likes (Likes)

| Field | Description | Example Value |
|-------|-------------|---------------|
| postId | Liked post | (post ID) |

### follows (Follow Relationships)

| Field | Description | Example Value |
|-------|-------------|---------------|
| followerId | The person who follows | (user ID) |
| followingId | The person being followed | (user ID) |

***

## Table Management

Prompts for creating and managing data storage.

### Create All Tables at Once

{% hint style="success" %}
✅ **Try saying this to the AI**

"I want to build a social network. I need user profiles, posts, comments, likes, and follow features. Create all the required storage. Show me the structure before creating it."
{% endhint %}

### Check Structure

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me the structure of the post storage."
{% endhint %}

### Add a Field

{% hint style="success" %}
✅ **Try saying this to the AI**

"Add the ability to store a personal website URL in profiles."
{% endhint %}

***

## Profile Management

Prompts for creating, updating, and uploading profile pictures.

### Create Profile

{% hint style="success" %}
✅ **Try saying this to the AI**

"Create my profile. Set the nickname to 'DevKim' and the bio to 'I am a full-stack developer'."
{% endhint %}

### Update Profile

{% hint style="success" %}
✅ **Try saying this to the AI**

"Change my bio to 'Passionate about backend development'."
{% endhint %}

### View Profile

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me SocialKim's profile information."
{% endhint %}

### Change Profile Picture

{% hint style="success" %}
✅ **Try saying this to the AI**

"I want to change my profile picture. Prepare an image upload for me."
{% endhint %}

{% hint style="info" %}
💡 When the AI issues an upload URL, upload the image to that URL from the app, and the profile picture will be automatically linked.
{% endhint %}

***

## Posts & Comments

Prompts for creating, updating, deleting posts and managing comments.

### Create a Post

{% hint style="success" %}
✅ **Try saying this to the AI**

"Create a post. The content should be 'I started a new project today!'"
{% endhint %}

### Update a Post

{% hint style="success" %}
✅ **Try saying this to the AI**

"Change the content of the post I just created to 'First milestone achieved for the project!'"
{% endhint %}

### Delete a Post

{% hint style="success" %}
✅ **Try saying this to the AI**

"Delete the post I just created."
{% endhint %}

### View My Posts

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me my 10 most recent posts."
{% endhint %}

### Create a Comment

{% hint style="success" %}
✅ **Try saying this to the AI**

"Add a comment 'Congrats! Keep it up!' to that post."
{% endhint %}

### View Comments

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me all comments on that post."
{% endhint %}

### Post with Image Attachment

{% hint style="success" %}
✅ **Try saying this to the AI**

"I want to create a post with an image. Prepare an image upload for me."
{% endhint %}

{% hint style="info" %}
💡 Creating a post with an image is a 3-step process: (1) Issue upload URL → (2) Upload image → (3) Create post with image included. The AI will guide you through each step.
{% endhint %}

***

## Likes

Prompts for adding, removing, and checking likes.

### Add Like

{% hint style="success" %}
✅ **Try saying this to the AI**

"Like that post."
{% endhint %}

### Remove Like

{% hint style="success" %}
✅ **Try saying this to the AI**

"Remove my like from that post."
{% endhint %}

### Check Like Count

{% hint style="success" %}
✅ **Try saying this to the AI**

"Tell me how many likes that post has."
{% endhint %}

***

## Follows

Prompts for following, unfollowing, and viewing lists.

### Follow

{% hint style="success" %}
✅ **Try saying this to the AI**

"Follow 'SocialKim'."
{% endhint %}

### Unfollow

{% hint style="success" %}
✅ **Try saying this to the AI**

"Unfollow 'SocialKim'."
{% endhint %}

### Followers List

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me the list of people who follow me."
{% endhint %}

### Following List

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me the list of people I follow."
{% endhint %}

### Check Follow Status

{% hint style="success" %}
✅ **Try saying this to the AI**

"Check if I am following 'SocialKim'."
{% endhint %}

***

## Feeds

Prompts for latest feeds, following feeds, and popular posts.

### Latest Feed

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me the 20 most recent posts."
{% endhint %}

### Following-Based Feed

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me the latest posts from people I follow."
{% endhint %}

{% hint style="info" %}
💡 The AI automatically checks your following list first, then queries posts from those users.
{% endhint %}

### Popular Posts

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me the 10 most liked posts."
{% endhint %}

### Image Posts Only

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me only posts from today that have images."
{% endhint %}

### Posts by Specific User

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me SocialKim's posts sorted by newest first."
{% endhint %}

***

## Complex Scenarios

Prompts that request multiple tasks at once. The AI automatically analyzes the required steps and processes them sequentially.

### New Account Initial Setup

{% hint style="success" %}
✅ **Try saying this to the AI**

"I just signed up. Set up my profile and create my first post. Use 'SocialLover' for the nickname, 'I love connecting with people' for the bio, and 'Hello! I just joined' for the first post."
{% endhint %}

### Activity Summary

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me my activity summary. Tell me how many posts I have, how many followers I have, and how many people I follow."
{% endhint %}

AI response example:

```text
Activity Summary:
- Posts: 15
- Followers: 42
- Following: 28
- Most popular post: "AI Trend Analysis" (45 likes)
```

### Comprehensive User Info Query

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me SocialKim's profile, 5 most recent posts, and follower count."
{% endhint %}

### Post + Comment + Like All at Once

{% hint style="success" %}
✅ **Try saying this to the AI**

"Create a post saying 'Weekend project complete!', then add a comment 'Awesome!' and a like to SocialKim's latest post."
{% endhint %}

### Feed Curation

{% hint style="success" %}
✅ **Try saying this to the AI**

"From this week's popular posts, show me only the ones from people I follow."
{% endhint %}

***

## Prompt Writing Tips

{% hint style="info" %}
💡 Follow these tips for effective prompts.

- **Be specific**: "Create a post saying 'Hello!'" is more precise than "Create a post."
- **You can request multiple tasks at once**: The AI automatically breaks them into the necessary steps and processes them.
- **Describe conditions in natural language**: Be specific about your desired conditions, such as "Show me only posts from today with 10+ likes."
- **Add "show me first" when creating new storage**: The AI will show you the structure and ask for confirmation before creating it.
{% endhint %}

***

## Reference

- [Database Overview](../../../database/01-overview.md) — Dynamic table concepts
- [List Data](../../../database/05-list.md) — Filters, sorting, pagination details
- [MCP Overview](../../../mcp/01-overview.md) — MCP tool setup and usage

***

## Next Steps

Check common errors and solutions in [99. Troubleshooting](99-troubleshooting.md).
