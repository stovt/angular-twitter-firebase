import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

interface User {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
}

exports.updateTweetUser = functions.firestore.document('users/{userId}').onUpdate(change => {
  const updatedUser = change.after.data() as User;

  const tweetsRef = admin.firestore().collection('tweets');

  return tweetsRef
    .where('user.userId', '==', updatedUser.userId)
    .get()
    .then(querySnapshot => 
      querySnapshot.docs.forEach(doc => 
        tweetsRef
          .doc(doc.id)
          .update({ user: updatedUser })
          .then(() => console.log(`Tweet with id: ${doc.id} has been successfully updated`))
          .catch(() => console.log(`Something went wrong while updating tweet with id: ${doc.id}`))
      )
    )
    .catch(() => console.log('Something went wrong while fetching user tweets :('));
});

exports.deleteUser = functions.auth.user().onDelete(user => {
  return admin
    .firestore()
    .doc(`users/${user.uid}`)
    .delete()
    .then(() => console.log(`User with id: ${user.uid} has been successfully deleted`))
    .catch(() => console.log(`Something went wrong while deleting user with id: ${user.uid}`));
});

exports.deleteUserTweets = functions.auth.user().onDelete(user => {
  const tweetsRef = admin.firestore().collection('tweets');

  return tweetsRef
    .where('user.userId', '==', user.uid)
    .get()
    .then(querySnapshot => 
      querySnapshot.docs.forEach(doc => 
        tweetsRef
          .doc(doc.id)
          .delete()
          .then(() => console.log(`Tweet with id: ${doc.id} has been successfully deleted`))
          .catch(() => console.log(`Something went wrong while deleting tweet with id: ${doc.id}`))
      )
    )
    .catch(() => console.log('Something went wrong while fetching user tweets :('));
});