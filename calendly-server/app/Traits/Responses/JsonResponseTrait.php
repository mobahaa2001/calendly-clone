<?php

namespace App\Traits\Responses;

use Illuminate\Http\JsonResponse as HttpJsonResponse;

trait JsonResponseTrait
{
    /**
     * Respond with json response
     *
     * @param array|null $data
     * @param integer $status
     * @param string $message
     * @param array|null $error
     * @param array $headers
     * @return HttpJsonResponse
     */
    public function json($data = null, $status = 200, $message = '', $error = null, $headers = ['accept' => 'application/json']): HttpJsonResponse
    {
        return response()->json([
            'success' => $this->isSuccess($status),
            'data' => $data,
            'message' => $message,
            'error' => $error,
        ], $status, $headers);
    }

    /**
     * Check if the response is a success one
     *
     * @param integer $status
     * @return boolean
     */
    protected function isSuccess(int $status): bool
    {
        return mb_substr("$status", 0, 1) === "2";
    }
}
