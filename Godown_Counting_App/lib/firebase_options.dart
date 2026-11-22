// File configured for MAA MOTORS ERP Firestore & Cloud Sync.
// ignore_for_file: type=lint

class DefaultFirebaseOptions {
  static const String projectId = 'maa-motors-erp';
  static const String apiKey = 'AIzaSyD2KJqHyT84ErCFpWKUSLEFXdvnQ1s9SfQ';
  static const String appId = '1:96761506330:android:3f21d94d95d3135af27fa3';
  static const String messagingSenderId = '96761506330';
  static const String storageBucket = 'maa-motors-erp.firebasestorage.app';
  static const String authDomain = 'maa-motors-erp.firebaseapp.com';

  static Map<String, String> get asMap => {
        'projectId': projectId,
        'apiKey': apiKey,
        'appId': appId,
        'messagingSenderId': messagingSenderId,
        'storageBucket': storageBucket,
        'authDomain': authDomain,
      };
}
