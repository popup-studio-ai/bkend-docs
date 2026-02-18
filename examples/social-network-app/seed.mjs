#!/usr/bin/env node
/**
 * Social Network seed data script
 *
 * Usage: node seed.mjs
 *
 * Creates:
 * - 11 users (1 demo + 10 dummy)
 * - 11 profiles (avatar, nickname, bio)
 * - 30+ posts (with real images)
 * - 50+ comments
 * - Random likes & follow relationships
 *
 * Automatically cleans up existing data before seeding.
 */

const API_BASE = 'https://api-client.bkend.ai';
const PK = 'pk_789583afe20022e9278abac4c15aad3361afb526de4269b49dd93aeff56381f9';

// ─── User Data ───────────────────────────────────────────

const USERS = [
  { email: 'demo@bkend.ai', password: 'Bkend123$', name: 'Demo User', nickname: 'demo', bio: 'bkend demo account 🚀', avatar: 'demo' },
  { email: 'jiyeon.park@example.com', password: 'Test1234!', name: 'Jiyeon Park', nickname: 'jiyeon_cafe', bio: 'Cafe hopping & photography lover ☕📸', avatar: 'jiyeon' },
  { email: 'minho.kim@example.com', password: 'Test1234!', name: 'Minho Kim', nickname: 'minho_dev', bio: 'Fullstack developer | React & Node.js | Coding life', avatar: 'minho' },
  { email: 'soyoung.lee@example.com', password: 'Test1234!', name: 'Soyoung Lee', nickname: 'soyoung_mom', bio: 'Mom of two 👧👦 Cooking & parenting stories', avatar: 'soyoung' },
  { email: 'junwoo.choi@example.com', password: 'Test1234!', name: 'Junwoo Choi', nickname: 'junwoo_fit', bio: 'Fitness trainer 💪 Sharing a healthy lifestyle', avatar: 'junwoo' },
  { email: 'hana.jung@example.com', password: 'Test1234!', name: 'Hana Jung', nickname: 'hana_travels', bio: 'Traveling the world 🌍 30 countries done! Next up: South America', avatar: 'hana' },
  { email: 'taehyun.oh@example.com', password: 'Test1234!', name: 'Taehyun Oh', nickname: 'taehyun_photo', bio: 'Landscape photographer 🏔️ Capturing the beauty of nature', avatar: 'taehyun' },
  { email: 'eunji.han@example.com', password: 'Test1234!', name: 'Eunji Han', nickname: 'eunji_cooks', bio: 'Food blogger 🍳 Trying new recipes every day!', avatar: 'eunji' },
  { email: 'dongwook.shin@example.com', password: 'Test1234!', name: 'Dongwook Shin', nickname: 'dongwook_music', bio: 'Guitarist 🎸 Indie band member | Music is life', avatar: 'dongwook' },
  { email: 'yuri.kwon@example.com', password: 'Test1234!', name: 'Yuri Kwon', nickname: 'yuri_bookclub', bio: 'Reading 4 books a month 📚 Running a book club', avatar: 'yuri' },
  { email: 'seojin.nam@example.com', password: 'Test1234!', name: 'Seojin Nam', nickname: 'seojin_art', bio: 'Illustrator 🎨 Digital & watercolor', avatar: 'seojin' },
];

// ─── Post Data ───────────────────────────────────────────

const POSTS_DATA = [
  // demo (0)
  { userIdx: 0, content: 'Built a social network app with bkend! Completed with just 5 tables 🎉 Auth, profiles, posts, comments, likes, and follows — all covered.', image: 'tech-laptop' },
  { userIdx: 0, content: 'Describe your table schema to AI using MCP tools and it creates everything automatically. So convenient!', image: null },
  // Jiyeon Park (1)
  { userIdx: 1, content: 'Found a hidden gem cafe today ☕ A tiny roastery tucked in an alley — their pour-over is pure art. Ethiopian Yirgacheffe beans!', image: 'cafe-coffee' },
  { userIdx: 1, content: 'Weekend outing 🌸 Cherry blossoms are in full bloom at the lake! Seems like they bloomed a week earlier than last year.', image: 'cherry-blossom' },
  { userIdx: 1, content: 'Developed my first roll from a new film camera. There is a warm feeling that digital just can not replicate 📷', image: 'film-camera' },
  // Minho Kim (2)
  { userIdx: 2, content: 'Finished migrating a project to Next.js 16 App Router! Bundle size dropped 40% thanks to Server Components 🚀', image: 'code-screen' },
  { userIdx: 2, content: 'TIL: TypeScript 5.4 NoInfer utility type. Super useful for preventing inference in generics.', image: null },
  { userIdx: 2, content: 'Gave a talk at a dev meetup. Topic: "Building an MVP in 3 Days with BaaS" 🎤 Got great feedback!', image: 'conference' },
  // Soyoung Lee (3)
  { userIdx: 3, content: 'Made a strawberry cake with the kids 🍰 The decorating is a mess but it tastes amazing! Happy weekend afternoon.', image: 'strawberry-cake' },
  { userIdx: 3, content: 'My 5-year-old drew our family portrait 👨‍👩‍👧‍👦 Apparently dad only has three strands of hair 😂', image: 'kids-drawing' },
  { userIdx: 3, content: 'Today\'s lunch box 📦 Salmon rice balls + mini salad + fruit. The kids ate everything!', image: 'lunch-box' },
  // Junwoo Choi (4)
  { userIdx: 4, content: 'Today\'s workout log 💪 Hit 100kg bench press for 3 sets! Started at 70kg six months ago — consistency is key.', image: 'gym-workout' },
  { userIdx: 4, content: 'Healthy meal prep 🥗 Grilled chicken breast + brown rice + broccoli. 40g protein secured!', image: 'healthy-meal' },
  { userIdx: 4, content: 'Early morning riverside run at 6 AM 🏃 Had the bridge all to myself! 10km at 5:30 pace.', image: 'morning-run' },
  // Hana Jung (5)
  { userIdx: 5, content: 'Sagrada Familia in Barcelona 🇪🇸 Speechless at Gaudi\'s genius. They\'ve been building it for 140 years!', image: 'sagrada-familia' },
  { userIdx: 5, content: 'Hot air balloon in Cappadocia, Turkey 🎈 The view from above at sunrise is something I will never forget.', image: 'hot-air-balloon' },
  { userIdx: 5, content: 'Bamboo forest in Kyoto, Japan 🎋 Taken in Arashiyama. The moment sunlight peeked through the bamboo was pure magic.', image: 'bamboo-forest' },
  // Taehyun Oh (6)
  { userIdx: 6, content: 'Sunrise at Ulsanbawi Rock 🌄 Left at 3 AM to capture this single shot. No pain, no gain.', image: 'mountain-sunrise' },
  { userIdx: 6, content: 'Milky Way over Jeju Island ✨ Incredible how clear the stars were. ISO 3200, 25s exposure.', image: 'milky-way' },
  { userIdx: 6, content: 'Winter sea at the coast 🌊 Rough waves and a lighthouse. Converted to black & white — totally different vibe.', image: 'winter-sea' },
  // Eunji Han (7)
  { userIdx: 7, content: 'Today\'s recipe: Cream pasta 🍝 Used cashew cream instead of heavy cream! Even my vegan friend loved it.', image: 'cream-pasta' },
  { userIdx: 7, content: 'Weekend baking 🥐 Attempted croissants! 27 layers of folding... Got the layers right but butter leaked a bit. Gotta keep it colder next time!', image: 'croissant' },
  { userIdx: 7, content: 'Homemade ramen from scratch 🍜 Simmered tonkotsu broth for 12 hours. The rich flavor is incredible!', image: 'ramen' },
  // Dongwook Shin (8)
  { userIdx: 8, content: 'Busking today 🎸 Played for 2 hours on the street. The crowd sang along with me!', image: 'busking' },
  { userIdx: 8, content: 'Working on a new song 🎵 Starting with the guitar riff and layering the melody on top. Going for an acoustic ballad this time!', image: 'guitar-recording' },
  { userIdx: 8, content: 'At the band rehearsal studio 🥁 New drummer just joined and the chemistry is unreal. Can\'t wait for the next gig!', image: 'band-practice' },
  // Yuri Kwon (9)
  { userIdx: 9, content: 'Book of the month 📖 "The God of Small Things" by Arundhati Roy. A story about India\'s caste system and forbidden love. Every sentence reads like poetry.', image: 'book-reading' },
  { userIdx: 9, content: 'Book club recap 📚 This week\'s theme: "Exploring Murakami\'s complete works." Eight of us presented our favorite pieces!', image: 'book-club' },
  { userIdx: 9, content: 'Re-read "No Longer Human" after 10 years and my perspective is completely different in my 30s vs 20s. Guess I\'ve grown (maybe).', image: null },
  // Seojin Nam (10)
  { userIdx: 10, content: 'Finished today\'s illustration 🎨 A cityscape at night in watercolor style. 3 hours on Procreate!', image: 'digital-art' },
  { userIdx: 10, content: 'Commission complete! A pet cat portrait 🐱 There is something fun about drawing each strand of fur.', image: 'cat-portrait' },
  { userIdx: 10, content: 'Art market recap 🖼️ Sold out 50 postcards and 100 stickers! So touched that people loved the handmade goods.', image: 'art-market' },
];

// ─── Comment Data ────────────────────────────────────────

const COMMENTS_TEMPLATES = [
  'Wow, this is amazing! 😍',
  'That\'s impressive!',
  'I want to try this too!',
  'Awesome 👏',
  'Oh thanks for the info!',
  'Wow, that\'s so beautiful',
  'I need to visit there!',
  'Great tip haha',
  'Love the vibes!',
  'Let\'s go together next time~',
  'How did you do that?',
  'So jealous 😭',
  'The best! 👍',
  'This looks so delicious',
  'Oh great info!',
  'The photo is absolutely stunning',
  'Maybe I should start too...',
  'So touching 😭',
  'Really?? Amazing!',
  'Keep it up! 💪',
  'That\'s so cute haha',
  'Let\'s meet up sometime!',
  'Saving this one 📌',
  'Totally relate to this!',
  'You\'ve really improved!',
];

// ─── Helpers ────────────────────────────────────────────────

async function api(path, { method = 'GET', body, token } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'X-API-Key': PK,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }

  if (!res.ok) {
    console.error(`❌ ${method} ${path} → ${res.status}`, typeof json === 'object' ? JSON.stringify(json) : json);
    return null;
  }

  if (json && typeof json === 'object' && json.success === true && json.data !== undefined) {
    return json.data;
  }
  return json;
}

function decodeJwtPayload(token) {
  const payload = token.split('.')[1];
  return JSON.parse(Buffer.from(payload, 'base64url').toString());
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function avatarUrl(seed) {
  return `https://i.pravatar.cc/200?u=${seed}`;
}

function postImageUrl(seed) {
  const id = Math.abs(hashCode(seed)) % 1000 + 10;
  return `https://picsum.photos/id/${id}/800/600`;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0;
  }
  return hash;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Cleanup ────────────────────────────────────────────────

async function cleanup(allUsers) {
  console.log('🧹 Cleaning up existing data (each user deletes own)...\n');

  // Order matters: likes/comments first (references posts), then posts, profiles last
  const tables = ['likes', 'comments', 'follows', 'posts', 'profiles'];

  for (const table of tables) {
    let totalDeleted = 0;

    for (const user of allUsers) {
      let deleted = 0;
      while (true) {
        // Fetch only this user's records using createdBy filter
        const result = await api(
          `/v1/data/${table}?limit=50&andFilters=${encodeURIComponent(JSON.stringify({ createdBy: user.userId }))}`,
          { token: user.accessToken },
        );
        const items = result?.items || result || [];
        if (!Array.isArray(items) || items.length === 0) break;

        for (const item of items) {
          const del = await api(`/v1/data/${table}/${item.id}`, {
            method: 'DELETE',
            token: user.accessToken,
          });
          if (del !== null) deleted++;
          await sleep(50);
        }
      }
      totalDeleted += deleted;
    }

    if (totalDeleted > 0) {
      console.log(`  🗑️  ${table}: ${totalDeleted} records deleted`);
    } else {
      console.log(`  ⏭️  ${table}: no data`);
    }
  }

  console.log('');
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Social Network seed data generation started\n');

  // ── 1. Sign up users ──
  console.log('📝 Step 1: User signup (11 users)');
  const userTokens = [];

  for (const user of USERS) {
    const result = await api('/v1/auth/email/signup', {
      method: 'POST',
      body: {
        method: 'password',
        email: user.email,
        password: user.password,
        name: user.name,
      },
    });

    if (result && result.accessToken) {
      const jwt = decodeJwtPayload(result.accessToken);
      userTokens.push({
        email: user.email,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        userId: jwt.sub,
        name: user.name,
      });
      console.log(`  ✅ ${user.name} (${user.email}) → ${jwt.sub}`);
    } else {
      console.log(`  ⚠️  ${user.email} signup failed, trying login...`);
      const loginResult = await api('/v1/auth/email/signin', {
        method: 'POST',
        body: {
          method: 'password',
          email: user.email,
          password: user.password,
        },
      });
      if (loginResult && loginResult.accessToken) {
        const jwt = decodeJwtPayload(loginResult.accessToken);
        userTokens.push({
          email: user.email,
          accessToken: loginResult.accessToken,
          refreshToken: loginResult.refreshToken,
          userId: jwt.sub,
          name: user.name,
        });
        console.log(`  ✅ ${user.name} logged in → ${jwt.sub}`);
      } else {
        console.log(`  ❌ ${user.name} skipped`);
        userTokens.push(null);
      }
    }
    await sleep(300);
  }

  const validUsers = userTokens.filter(Boolean);
  console.log(`\n  ${validUsers.length} users ready\n`);

  // ── 1.5. Cleanup existing data (each user deletes own records) ──
  if (validUsers.length > 0) {
    await cleanup(validUsers);
  }

  // ── 2. Create profiles ──
  console.log('👤 Step 2: Create profiles');
  for (let i = 0; i < USERS.length; i++) {
    const ut = userTokens[i];
    if (!ut) continue;
    const user = USERS[i];

    const profile = await api('/v1/data/profiles', {
      method: 'POST',
      token: ut.accessToken,
      body: {
        userId: ut.userId,
        nickname: user.nickname,
        bio: user.bio,
        avatarUrl: avatarUrl(user.avatar),
      },
    });

    if (profile) {
      console.log(`  ✅ ${user.nickname} profile created`);
    }
    await sleep(200);
  }

  // ── 3. Create posts ──
  console.log('\n📝 Step 3: Create posts');
  const createdPosts = [];

  for (const postData of POSTS_DATA) {
    const ut = userTokens[postData.userIdx];
    if (!ut) continue;

    const body = { content: postData.content, likesCount: 0, commentsCount: 0 };
    if (postData.image) {
      body.imageUrl = postImageUrl(postData.image);
    }

    const post = await api('/v1/data/posts', {
      method: 'POST',
      token: ut.accessToken,
      body,
    });

    if (post) {
      createdPosts.push({ id: post.id, userIdx: postData.userIdx, content: postData.content.substring(0, 30) });
      console.log(`  ✅ [${USERS[postData.userIdx].nickname}] ${postData.content.substring(0, 50)}...`);
    }
    await sleep(200);
  }

  console.log(`\n  ${createdPosts.length} posts created\n`);

  // ── 4. Create comments ──
  console.log('💬 Step 4: Create comments');
  let commentCount = 0;

  for (const post of createdPosts) {
    const numComments = randomInt(2, 5);
    const commenters = shuffle(validUsers.filter(u => u.userId !== userTokens[post.userIdx]?.userId)).slice(0, numComments);
    let postCommentCount = 0;

    for (const commenter of commenters) {
      const comment = await api('/v1/data/comments', {
        method: 'POST',
        token: commenter.accessToken,
        body: {
          postId: post.id,
          content: randomPick(COMMENTS_TEMPLATES),
        },
      });

      if (comment) {
        commentCount++;
        postCommentCount++;
      }
      await sleep(100);
    }

    if (postCommentCount > 0) {
      await api(`/v1/data/posts/${post.id}`, {
        method: 'PATCH',
        token: userTokens[post.userIdx].accessToken,
        body: { commentsCount: postCommentCount },
      });
    }
  }
  console.log(`  ✅ ${commentCount} comments created\n`);

  // ── 5. Create likes ──
  console.log('❤️ Step 5: Create likes');
  let likeCount = 0;

  for (const post of createdPosts) {
    const numLikes = randomInt(3, 8);
    const likers = shuffle(validUsers).slice(0, numLikes);
    let postLikeCount = 0;

    for (const liker of likers) {
      const like = await api('/v1/data/likes', {
        method: 'POST',
        token: liker.accessToken,
        body: { postId: post.id },
      });

      if (like) {
        likeCount++;
        postLikeCount++;
      }
      await sleep(50);
    }

    if (postLikeCount > 0) {
      await api(`/v1/data/posts/${post.id}`, {
        method: 'PATCH',
        token: userTokens[post.userIdx].accessToken,
        body: { likesCount: postLikeCount },
      });
    }
  }
  console.log(`  ✅ ${likeCount} likes created\n`);

  // ── 6. Create follow relationships ──
  console.log('👥 Step 6: Create follow relationships');
  let followCount = 0;

  for (let i = 0; i < validUsers.length; i++) {
    const follower = validUsers[i];
    const numFollows = randomInt(3, 7);
    const targets = shuffle(validUsers.filter(u => u.userId !== follower.userId)).slice(0, numFollows);

    for (const target of targets) {
      const follow = await api('/v1/data/follows', {
        method: 'POST',
        token: follower.accessToken,
        body: {
          followerId: follower.userId,
          followingId: target.userId,
        },
      });

      if (follow) {
        followCount++;
      }
      await sleep(50);
    }
  }
  console.log(`  ✅ ${followCount} follow relationships created\n`);

  // ── Done ──
  console.log('═══════════════════════════════════════');
  console.log('🎉 Seed data generation complete!');
  console.log('═══════════════════════════════════════');
  console.log(`  👤 Users: ${validUsers.length}`);
  console.log(`  📝 Posts: ${createdPosts.length}`);
  console.log(`  💬 Comments: ${commentCount}`);
  console.log(`  ❤️  Likes: ${likeCount}`);
  console.log(`  👥 Follows: ${followCount}`);
  console.log('');
  console.log('📌 Demo account: demo@bkend.ai / Bkend123$');
  console.log('═══════════════════════════════════════');
}

main().catch(console.error);
