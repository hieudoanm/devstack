package utils

import (
	"fmt"
	"strconv"
)

// AddZero ...
func AddZero(number int) string {
	if number < 9 {
		return fmt.Sprintf("0%d", number)
	}
	return strconv.Itoa(number)
}
