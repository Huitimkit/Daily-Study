/**
 * @param {number[]} nums
 * @return {number[]}
 */
var nextGreaterElements = function(nums) {
  const stack = []
  const res = []
  const len = nums.length
  for (let i = 2 * len - 1; i >= 0; i--) {
    while(stack.length && stack[stack.length - 1] <= nums[i % len]) {
      stack.pop()
    }
    res[i % len] = stack.length ? stack[stack.length - 1] : -1
    stack.push(nums[i % len])
  }
  console.log(res)
};

nextGreaterElements([2,1,2,4,3])