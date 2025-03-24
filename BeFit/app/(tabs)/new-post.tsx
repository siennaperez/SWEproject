// // app/new-post.tsx
// import { useState, useRef, useEffect } from 'react';
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import CameraComponent, { Camera } from 'expo-camera';
// import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';

// export default function NewPostScreen() {
//   const router = useRouter();
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [photoUri, setPhotoUri] = useState<string | null>(null);
//   const [caption, setCaption] = useState('');
//   const cameraRef = useRef<any>(null);


//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const takePhoto = async () => {
//     if (cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
//         setPhotoUri(photo.uri);
//       } catch (error) {
//         console.error("Error taking photo:", error);
//       }
//     }
//   };

//   if (hasPermission === null) return <Text>Requesting camera permission...</Text>;
//   if (hasPermission === false) return <Text>No access to camera</Text>;

//   return (
//     <View style={styles.container}>
//       {/* Back Button */}
//       <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//         <Ionicons name="arrow-back" size={28} color="black" />
//       </TouchableOpacity>

//       <Text style={styles.title}>Create New Post</Text>

//       {/* Camera or Preview */}
//       {photoUri ? (
//         <Image source={{ uri: photoUri }} style={styles.previewImage} />
//       ) : (
//         // <CameraComponent style={styles.camera} ref={cameraRef} />

//       )}

//       {/* Take Photo / Retake */}
//       <TouchableOpacity
//         style={styles.captureButton}
//         onPress={photoUri ? () => setPhotoUri(null) : takePhoto}
//       >
//         <Text style={styles.captureButtonText}>
//           {photoUri ? 'Retake Photo' : 'Take Photo'}
//         </Text>
//       </TouchableOpacity>

//       {/* Caption */}
//       <TextInput
//         style={styles.captionInput}
//         placeholder="Write a caption..."
//         value={caption}
//         onChangeText={setCaption}
//         multiline
//       />

//       {/* Submit */}
//       <TouchableOpacity
//         style={styles.postButton}
//         onPress={() => {
//           // You can pass data or store it globally here
//           router.back();
//         }}
//         disabled={!photoUri}
//       >
//         <Text style={styles.postButtonText}>Post</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     paddingTop: 60,
//     backgroundColor: '#fff',
//   },
//   backButton: {
//     position: 'absolute',
//     top: 40,
//     left: 20,
//     zIndex: 1,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   camera: {
//     width: '100%',
//     height: 250,
//     borderRadius: 10,
//     overflow: 'hidden',
//     marginBottom: 10,
//   },
//   previewImage: {
//     width: '100%',
//     height: 250,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   captureButton: {
//     backgroundColor: '#000',
//     padding: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   captureButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   captionInput: {
//     height: 100,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     textAlignVertical: 'top',
//     marginBottom: 20,
//   },
//   postButton: {
//     backgroundColor: '#000',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   postButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });
