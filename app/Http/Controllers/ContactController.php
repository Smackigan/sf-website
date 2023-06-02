<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mailer\Mailer;

class ContactController extends Controller
{
    public function sendEmail(Request $request, Mailer $mailer)
    {
    // Validate the form data
    $validatedData = $request->validate([
        'name' => 'required',
        'email' => 'required|email',
        'phone' => 'required', 
        'message' => 'required',
    ]);

    // Send the email
    $email = (new Email())
        ->from(new Address($validatedData['email'], $validatedData['name']))
        ->to('smack01@mail.ru')
        ->subject('New Contact Form Submission')
        ->text($validatedData['message']);

        $mailer = new Mailer($transport);

        $mailer->send($email);

        // Return a response or redirect
        return response()->json(['message' => 'Email sent successfully']);
    }
    
    
}
