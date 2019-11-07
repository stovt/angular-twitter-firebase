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

  const tweetRef = admin.firestore().collection('tweets');

  tweetRef
    .where('user.userId', '==', updatedUser.userId)
    .get()
    .then(querySnapshot => {
      console.log('TCL: querySnapshot', querySnapshot.docs);
      querySnapshot.docs.forEach(doc => {
        console.log('TCL: doc', doc);
        tweetRef
          .doc(doc.id)
          .update({ user: updatedUser })
          .then(() => console.log(`Tweet with id: ${doc.id} has been successfully updated`))
          .catch(() => console.log(`Something went wrong while updating tweet with id: ${doc.id}`));
      });
    })
    .catch(() => console.log('Something went wrong while fetching user tweets :('));
  
  return change.after.ref.set(updatedUser);
});
