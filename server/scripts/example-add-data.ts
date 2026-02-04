/**
 * Example script showing how to programmatically add data to the database
 * 
 * Run: npx tsx server/scripts/example-add-data.ts
 */

import prisma from '../prisma/client.js';
import bcrypt from 'bcryptjs';

async function addExampleData() {
  try {
    console.log('🚀 Starting to add example data...');

    // 1. Create a user
    const hashedPassword = await bcrypt.hash('example123', 12);
    
    const user = await prisma.user.create({
      data: {
        name: 'Example User',
        email: 'example@test.com',
        password: hashedPassword,
      },
    });
    console.log('✅ Created user:', user.email);

    // 2. Create a post for that user
    const post = await prisma.post.create({
      data: {
        title: 'Example Post Title',
        message: 'This is an example post created programmatically!',
        name: user.name,
        creator: user.id,
        tags: ['example', 'programmatic', 'test'],
        selectedFile: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        likes: [],
      },
    });
    console.log('✅ Created post:', post.title);

    // 3. Create a comment on that post
    const comment = await prisma.comment.create({
      data: {
        text: 'This is an example comment!',
        authorId: user.id,
        authorName: user.name,
        postId: post.id,
      },
    });
    console.log('✅ Created comment:', comment.text);

    // 4. Create a reply to that comment
    const reply = await prisma.reply.create({
      data: {
        text: 'This is an example reply!',
        authorId: user.id,
        authorName: user.name,
        commentId: comment.id,
      },
    });
    console.log('✅ Created reply:', reply.text);

    console.log('\n🎉 Successfully added example data!');
    console.log(`   User ID: ${user.id}`);
    console.log(`   Post ID: ${post.id}`);
    console.log(`   Comment ID: ${comment.id}`);
    console.log(`   Reply ID: ${reply.id}`);

  } catch (error) {
    console.error('❌ Error adding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
addExampleData();
