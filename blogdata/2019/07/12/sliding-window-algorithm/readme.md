---
published: true
tags:
 - Algorithms
 - Sliding Window
 - Computer Science
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Sliding Window Algorithm
url-slug: sliding-window-algorithm
first-published-on: 2019-07-12 01:45 pm
last-updated-on: 2019-09-06 00:38
meta:
 description: "An exposition of the sliding window algorithm."
excerpt: "The best way to understand the sliding window algorithm is to work with an example. Say we have an array of integers,"
---

# Sliding Window Algorithm

${toc}

## Basic Algorithm

The best way to understand the sliding window algorithm is to work with an example. Say we have an array of integers, `[1, 2, 3, 4, 5, 6, 7, 8]`. If we have to calculate the sum of a sub-array of 3 elements from the array, as we move from left to right, the sliding window approach wil work as follows:

1. Take elements `1, 2, 3`. Sum = 1+2+3 = 6.
2. Take elements `2, 3, 4`. Sum = 2+3+4 = 9.
3. Take elements `3, 4, 5`. Sum = 3+4+5 = 12.
4. Take elements `4, 5, 6`. Sum = 4+5+6 = 15.
5. Take elements `5, 6, 7`. Sum = 5+6+7 = 18.
6. Take elements `6, 7, 8`. Sum = 6+7+8 = 21.

When we move on to the next sub-array, we slide the window to the right by one element. Considering sub-array [1, 2, 3] and [2, 3, 4], to get to [2, 3, 4], we removed 1 and added 4 into the original sub-array [1, 2, 3]. So, if we are to reuse the `sum` from the previous sub-array of [1, 2, 3], we will have to subtract the element going out of the window and add the element now being included in the sliding window.

```plaintext
Sum of sub-array [1, 2, 3] = 1+2+3 = 6.
Sum of sub-array [2, 3, 4]
  = (Sum of previous sub-array - outgoing element at the extreme left)
      + incoming element at the extreme right
  = (6 - 1) + 4
  = 5+4
  = 9
```

### Code Sample

Let us see how we can implement this algorithm in Java.

```java
// In the above example k is 3.
public static int[] findSum_slidingWindow(int k, int[] arr) {
  int[] result = new int[arr.length - k + 1];
  double windowSum = 0;
  int windowStart = 0;
  for (int windowEnd = 0; windowEnd < arr.length; windowEnd++) {
    windowSum += arr[windowEnd]; // add the next element
    // slide the window, if we have hit the required window size of 'k'
    if (windowEnd >= k - 1) {
      result[windowStart] = windowSum; // calculate the sum
      windowSum -= arr[windowStart]; // subtract the element going out
      windowStart++; // slide the window ahead
    }
  }  
  return result;
}
```

### Time Complexity

The time complexity of the is O(N).

### Space Complexity

The algorithm runs in constant space. So the space complexity is O(1).

## Variation - Keeping Track of Data

Some problems need a variation of the sliding window algorithm that involves keeping track of certain data. Let us look at this variation using an example problem.

## References and Further Reading

1. [Window Sliding Technique](https://www.geeksforgeeks.org/window-sliding-technique/)
2. [A Collection of Whiteboard Interview Templates - Jeremy Aguilon](https://jeremyaguilon.me/blog/a_collection_of_whiteboard_interview_templates)
3. [Visualizing Four Key Technical Interview Algorithms - Jeremy Aguilon](https://jeremyaguilon.me/blog/visualizing_four_key_interview_algorithms)
