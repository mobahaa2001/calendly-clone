<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ArrKeysIn implements Rule
{
    protected $target = [];

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(array $target)
    {
        $this->target = $target;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return count(array_diff(array_keys($value), $this->target)) === 0;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'One or more keys of the :attribute are invalid.';
    }
}
