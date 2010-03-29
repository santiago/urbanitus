{
   "by_email": {
       "map": "function(doc) { \t    emit(doc.email, doc); \t}"
   },
   "by_username": {
       "map": "function(doc) { \t    emit(doc.username, doc); \t}"
	   },
       "login": {
	   "map": "function(doc) { 
var value= {username:true,email:true};
for (attr in doc) {
if (value[attr]) {
value[attr]=doc[attr];
}
}
emit([doc.username,doc.password], value);
}"
 }
}