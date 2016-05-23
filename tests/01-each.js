/* the cook
Well, that was easy...
And now for something completely different
write the function each.
each must behave like Array.forEach, takes in an array as second argument
*/

const baseTestArray = [ 4, 1, 2, 3 ]
var counter = 0

// given function must be called 4 times
each(() => counter++, baseTestArray)

isTrue(counter === 4)

// first argument shoud be the value
counter = 0
const addToCounter = value => counter += value 
each(addToCounter, baseTestArray)

isTrue(counter === 10)

// the second argument should be the index
each((value, index) => isTrue(baseTestArray[index] === value), baseTestArray)

// the third and last argument should be the array
each((v, i, givenArray) => isTrue(baseTestArray === givenArray), baseTestArray)

// each must return the given array
const myRef = []
isTrue(each(() => {}, myRef) === myRef)

/* the cook
It's all well and good
but why stop here ?
Let's try to add some functional spices to the mix
what about... some curry !
*/

const storeArray = []
const accummulate = each(value => storeArray.push(value))

accummulate([ 1, 2, 3 ])
accummulate([ 4, 5, 6 ])

isTrue(storeArray.length === 6)

isTrue(storeArray[3] === 4)

/* the cook
Hummm smells good...
Now, is it faster than forEach ?
*/

const addEachToCounter = each(addToCounter)
const bigArray = Array(5000000).join().split(',')

const startTime = performance.now()
counter = 0
bigArray.forEach(addToCounter)

const midTime = performance.now()

counter = 0
addEachToCounter(bigArray)

const endTime = performance.now()

const nativeForEachDelta = midTime - startTime
const yourEachDelta =  endTime - midTime

console.log({ nativeForEachDelta, yourEachDelta })

// You should be faster
isTrue(yourEachDelta < nativeForEachDelta)

const times = nativeForEachDelta / yourEachDelta

// Arround 5 times faster will pass, but you should have arround 10x
isTrue(times > 5)

/* the cook
while and for have breaks tought, looping through those bigs arrays is slow
what if we could explicitly break the loop if the function return false ?
*/

counter = 0
const iter5Times = each(() => ++counter < 5)

iter5Times(bigArray)

isTrue(counter === 5)

/* the cook
Ok we got a nice currying, some good performances, better control.
How about adding some feature, array all day is pretty dull.
Let's see how we could handle Objects too !
*/

const handyObject = {
  a: 1,
  b: 32,
  c: 45,
  d: 25,
}

counter = 0
addEachToCounter(handyObject)

isTrue(counter === 103)

/* the cook
What about something more fancy this time ?
Mix in some modern Set and Map.
*/

const modernSet = new Set()
const modernMap = new Map()
const addToSet = each(modernSet.add.bind(modernSet))
const addToMap = each((value, key) => modernMap.set(key, value))

addToMap(handyObject)
addToSet(handyObject)

counter = 0
addEachToCounter(modernSet)
isTrue(counter === 103)

counter = 0
addEachToCounter(modernMap)
isTrue(counter === 103)

/* the cook
Now that's a nice each !
*/
