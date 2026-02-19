// Quick Supabase connection test
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gfxvlwkvfqyeecnzilrz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeHZsd2t2ZnF5ZWVjbnppbHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NzE2OTksImV4cCI6MjA4NzA0NzY5OX0.BQtr7QUsQfzkI9SbygYgqAUkU3cBBvkLYaA_9y8-08I';
const demoCareCircleId = '11111111-1111-1111-1111-111111111111';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing Supabase connection...\n');

  // 1. Check if care_circles table exists and has demo circle
  console.log('1. Checking care_circles table...');
  const { data: circles, error: circlesError } = await supabase
    .from('care_circles')
    .select('*')
    .limit(5);
  
  if (circlesError) {
    console.log('   ERROR:', circlesError.message);
    console.log('   Code:', circlesError.code);
  } else {
    console.log('   Found', circles.length, 'care circles');
    circles.forEach(c => console.log('   -', c.id, c.name));
  }

  // 2. Check family_members table
  console.log('\n2. Checking family_members table...');
  const { data: members, error: membersError } = await supabase
    .from('family_members')
    .select('*')
    .limit(10);
  
  if (membersError) {
    console.log('   ERROR:', membersError.message);
    console.log('   Code:', membersError.code);
  } else {
    console.log('   Found', members.length, 'family members');
    members.forEach(m => console.log('   -', m.name, '(' + m.relationship + ')'));
  }

  // 3. Try inserting a test record
  console.log('\n3. Testing INSERT into family_members...');
  const testMember = {
    name: 'Test User ' + Date.now(),
    relationship: 'Test',
    care_circle_id: demoCareCircleId,
  };
  
  const { data: inserted, error: insertError } = await supabase
    .from('family_members')
    .insert([testMember])
    .select();
  
  if (insertError) {
    console.log('   INSERT ERROR:', insertError.message);
    console.log('   Code:', insertError.code);
    console.log('   Details:', insertError.details);
    console.log('   Hint:', insertError.hint);
  } else {
    console.log('   SUCCESS! Inserted:', inserted[0].id);
    
    // Clean up test record
    console.log('\n4. Cleaning up test record...');
    const { error: deleteError } = await supabase
      .from('family_members')
      .delete()
      .eq('id', inserted[0].id);
    
    if (deleteError) {
      console.log('   Delete error:', deleteError.message);
    } else {
      console.log('   Cleaned up successfully');
    }
  }

  console.log('\n--- Done ---');
}

test().catch(console.error);
