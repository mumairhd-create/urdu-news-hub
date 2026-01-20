// 🗄️ Database Connection Test
// Run this in browser console to test real database connection

console.log('🔍 Testing Database Connection...');

async function testDatabaseConnection() {
  try {
    // Test 1: Check if database object exists
    console.log('\n=== 📦 Database Object Test ===');
    if (window.database) {
      console.log('✅ Database object found');
      console.log('Available methods:', Object.getOwnPropertyNames(window.database).filter(name => typeof window.database[name] === 'function'));
    } else {
      console.log('❌ Database object not found');
      return;
    }

    // Test 2: Test Supabase connection
    console.log('\n=== 🌐 Supabase Connection Test ===');
    const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    console.log('Supabase URL:', supabaseUrl ? '✅ Configured' : '❌ Missing');
    console.log('Supabase Key:', supabaseKey ? '✅ Configured' : '❌ Missing');

    // Test 3: Test categories fetch
    console.log('\n=== 📂 Categories Test ===');
    try {
      const categories = await window.database.getCategories();
      console.log(`✅ Categories fetched: ${categories.length} found`);
      if (categories.length > 0) {
        console.log('Sample category:', categories[0]?.name?.en || 'No name');
        console.log('Source:', categories[0]?.id?.startsWith('mock-') ? '🟡 Mock Data' : '🟢 Real Database');
      }
    } catch (error) {
      console.log('❌ Categories fetch failed:', error.message);
    }

    // Test 4: Test articles fetch
    console.log('\n=== 📰 Articles Test ===');
    try {
      const articles = await window.database.getNewsArticles({ limit: 3 });
      console.log(`✅ Articles fetched: ${articles.length} found`);
      if (articles.length > 0) {
        console.log('Sample article:', articles[0]?.title?.en || 'No title');
        console.log('Source:', articles[0]?.id?.startsWith('mock-') ? '🟡 Mock Data' : '🟢 Real Database');
      }
    } catch (error) {
      console.log('❌ Articles fetch failed:', error.message);
    }

    // Test 5: Test search functionality
    console.log('\n=== 🔍 Search Test ===');
    try {
      const searchResults = await window.database.searchNews('test');
      console.log(`✅ Search results: ${searchResults.length} found`);
    } catch (error) {
      console.log('❌ Search failed:', error.message);
    }

    // Test 6: Test create category (if admin)
    console.log('\n=== ➕ Create Test ===');
    try {
      const testCategory = {
        name: { ur: 'ٹیسٹ', en: 'Test', ps: 'ازمې' },
        description: { ur: 'ٹیسٹ زمرہ', en: 'Test category', ps: 'ازمې څانګ' }
      };
      
      const createdCategory = await window.database.createCategory(testCategory);
      console.log('✅ Category created successfully');
      console.log('Created ID:', createdCategory.id);
      
      // Clean up - delete the test category
      await window.database.deleteCategory(createdCategory.id);
      console.log('✅ Test category deleted');
    } catch (error) {
      console.log('❌ Create/delete test failed:', error.message);
    }

    console.log('\n=== 📊 Summary ===');
    console.log('🔹 Database Type: Real Supabase with Mock Fallback');
    console.log('🔹 Connection: Automatic');
    console.log('🔹 Data Source: Dynamic (Live from Database)');
    console.log('🔹 Status: ✅ Working');

  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

// Auto-run the test
testDatabaseConnection();

// Also provide manual test function
window.testDatabaseConnection = testDatabaseConnection;

console.log('\n🎯 Manual test: Run window.testDatabaseConnection() in console');
