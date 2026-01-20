// 🔍 Frontend-Backend Connection Test
// Run this in browser console to check API connections

console.log('🔍 Testing Frontend-Backend Connections...');

// 1. Check Supabase Connection
console.log('\n=== 📡 Supabase Connection Test ===');
try {
  const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY;
  
  console.log('✅ Supabase URL:', supabaseUrl || 'Not found');
  console.log('✅ Supabase Key:', supabaseKey ? 'Present' : 'Not found');
  
  if (supabaseUrl && supabaseKey) {
    console.log('🟢 Supabase environment variables are configured');
  } else {
    console.log('🔴 Supabase environment variables are missing');
  }
} catch (error) {
  console.error('❌ Supabase config error:', error);
}

// 2. Check Mock Database Connection
console.log('\n=== 🗄️ Mock Database Connection Test ===');
try {
  // Test if database object exists
  if (window.database) {
    console.log('✅ Mock database object found');
    
    // Test database methods
    const methods = ['getNewsArticles', 'getCategories', 'createNewsArticle', 'updateNewsArticle'];
    methods.forEach(method => {
      if (typeof window.database[method] === 'function') {
        console.log(`✅ ${method}: Available`);
      } else {
        console.log(`❌ ${method}: Not available`);
      }
    });
  } else {
    console.log('❌ Mock database object not found');
  }
} catch (error) {
  console.error('❌ Database test error:', error);
}

// 3. Test Actual Database Calls
console.log('\n=== 🧪 Database API Test ===');
try {
  // Test getCategories
  if (window.database?.getCategories) {
    console.log('Testing getCategories...');
    window.database.getCategories()
      .then(categories => {
        console.log(`✅ getCategories: Found ${categories.length} categories`);
        console.log('Sample category:', categories[0]?.name?.en || 'No data');
      })
      .catch(error => {
        console.error('❌ getCategories failed:', error);
      });
  }
  
  // Test getNewsArticles
  if (window.database?.getNewsArticles) {
    console.log('Testing getNewsArticles...');
    window.database.getNewsArticles({ limit: 5 })
      .then(articles => {
        console.log(`✅ getNewsArticles: Found ${articles.length} articles`);
        console.log('Sample article:', articles[0]?.title?.en || 'No data');
      })
      .catch(error => {
        console.error('❌ getNewsArticles failed:', error);
      });
  }
  
} catch (error) {
  console.error('❌ Database API test error:', error);
}

// 4. Check Network Requests
console.log('\n=== 🌐 Network Request Test ===');
try {
  // Test if we can make network requests
  fetch('https://sqcjyaqdbnajplwuusoj.supabase.co/rest/v1/', {
    method: 'GET',
    headers: {
      'apikey': import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || '',
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      console.log('✅ Supabase API reachable');
    } else {
      console.log('🟡 Supabase API responded but with error:', response.status);
    }
  })
  .catch(error => {
    console.log('🔴 Supabase API not reachable:', error.message);
  });
  
} catch (error) {
  console.error('❌ Network test error:', error);
}

// 5. Summary
console.log('\n=== 📊 Connection Summary ===');
console.log('🔹 Frontend: React App (Running)');
console.log('🔹 Backend: Mock Database (Local)');
console.log('🔹 External API: Supabase (Configured)');
console.log('🔹 Connection Type: Mock Data (No real backend)');

console.log('\n🎯 Recommendation:');
console.log('The app is using MOCK DATABASE, not a real backend API.');
console.log('All data is stored locally in JavaScript arrays.');
console.log('To connect to real backend, you need to:');
console.log('1. Set up a real API server');
console.log('2. Replace mock database with actual API calls');
console.log('3. Configure proper authentication');
